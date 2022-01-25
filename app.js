//jshint esversion:6

const express=require("express")
const bodyParser=require("body-parser");
const mongoose=require("mongoose")
const _ =require("lodash")



const app=express()
let items=[]
let workitems=[]

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-anmol:test123@cluster0.y8oxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB",{useNewUrlParser: true})
const itemsSchema ={
    name: String
}
const Item=mongoose.model('Item',itemsSchema)


const item1=new Item({
    name: "Welcome to todo-list"
})
const item2=new Item({
    name: "Press + button to add to the list"
})
const item3=new Item({
    name: "Press <-- yo delete the item from list"
})
const defaultItems=[item1,item2,item3]


const listSchema={
    name:String,
    items:[itemsSchema]
}

const List=mongoose.model("List",listSchema)




app.get("/",function(req,res){
    
Item.find({},function(err,foundItems){

    if(foundItems.length===0) // here we uselength method bcz foundItems is array
    {
        Item.insertMany(defaultItems,function(err){
        if(err){
            console.log("Error")
        }
            else
            console.log("Succesfully saved to DB");
        }
    )
    res.redirect("/")
    }
    else{
        res.render("list",{listTitle: "Today",newListItems: foundItems}) 

    }

   

   
}) 

})


app.post("/",function(req,res){
    const itemName= req.body.newItems 
    const listName=req.body.List

    const item=new Item({
        name: itemName
    })

    if(listName==="Today"){
        item.save()
        res.redirect("/")
    

    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item)
            foundList.save()
            res.redirect("/"+listName)
        })
    }

   
    
})

app.post("/delete",function(req,res){
    const checkedItemId= req.body.checkbox
    const listName=req.body.listName

    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("Successfully deleted checked item");
                res.redirect("/")
            }
            
        })
        
    }else{List.findOneAndUpdate({name:listName},{$pull:{items:{_id: checkedItemId}}},function(err,foundList){
        if(!err){
            res.redirect("/"+ listName)
        }
    })

    }

    
})


app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName)

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //will create new ejs list
                const list=new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/"+ customListName)

            }
            else{

                res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
            }
        }

    })

 

})


app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List",newListItems: workitems}) 
})



app.get("/about",function(req,res){
   res.render("about")
})






app.listen(3000,function(){
    console.log("server is hosted on localserver:3000")
})