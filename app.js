const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require("lodash");
const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const url = process.env.MONGO_DB;
//async function main() {
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const todoSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", todoSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [todoSchema]
});
const List = mongoose.model("List", listSchema);
app.get("/", (req, res)=> {
    Item.find({}, (err, foundItems)=> {
        res.render("todo",
            {
                listType: "Today",
                newItem: foundItems
            });

    })
});

app.get("/:customList", (req, res)=> {
    var customList = _.capitalize(req.params.customList);
    List.findOne({name: customList},(err, foundItems)=> {
            if (!err) {
                if (!foundItems) {
                    var listItem = new List({
                        name: customList,
                        items: []
                    });
                    listItem.save();
                    res.redirect("/"+customList);
                } else {
                    res.render("todo", {
                        listType: foundItems.name, 
                        newItem: foundItems.items
                    });
                }
            }
        })
    

});
app.post("/", (req, res)=> {
    var inputItem = req.body.item;
    var listType = req.body.list;
    if (inputItem.trim().length == 0) {
        return res.redirect("/");
    }
    var newItem = new Item({
        item: inputItem
        });
    if(listType==="Today"){
        newItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listType},(err,foundItems)=>{
            foundItems.items.push(newItem);
            foundItems.save();
            res.redirect("/"+listType);
        })
    }
});

app.post("/delete", (req, res)=> {
    var deleteId = req.body.btn;
    var listName = req.body.deleteItem;
    if(listName==="Today"){
        Item.findByIdAndRemove(deleteId, (err)=> {});
    res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:deleteId}}},(err,foundItems)=>{
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
    
})
app.listen(process.env.PORT || 4000, ()=> {
    console.log("running");
});
