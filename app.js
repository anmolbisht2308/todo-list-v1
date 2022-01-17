//jshint esversion:6

const express=require("express")
const bodyParser=require("body-parser");
const date=require(__dirname + "/date.js")


const app=express()
let items=[]
let workitems=[]

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

app.get("/",function(req,res){
    
let day=date.getdate()  // if date.getday()  day will be shown
   
    res.render("list",{listTitle: day,newListItems: items}) 


})


app.post("/",function(req,res){
    let item= req.body.newItems


    if(req.body.List==="Work"){//if List was from work page and HERE "W" shoul be capital
        workitems.push(item)
        res.redirect("/work")

    }
    else
    {
        items.push(item)
        res.redirect("/")
    }
    


    
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