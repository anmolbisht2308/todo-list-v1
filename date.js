exports.getdate=function(){
let today=new Date()
let option={
weekday: "long",
day:"numeric",
month:"long"
}

return today.toLocaleDateString("en-Us",option)


}

exports.getday=function(){
let today=new Date()
let option={
weekday: "long",

}

return today.toLocaleDateString("en-Us",option)


}