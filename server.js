const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const upload = require('./multer')
const cloudinary = require('cloudinary');
const async = require('async')
var {mongoose} = require('./db/mongoose');
var {Point} = require('./models/details');
var {NewProducts} =  require('./models/new');
var {MegaSale} =  require('./models/mega');
var {Story} = require('./models/story');
var {parchaseH} = require('./models/parchaseH');
var {Storiesliked} = require('./models/storiesliked');
var {whishlist} = require('./models/whishlist');
const path = require('path')
var serveIndex = require('serve-index');

require('./cloudinary')
app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))



app.get('/api/newProducts', async (req, res) => {

  const newProducts = await NewProducts.find({})
  console.log(newProducts);
  res.send(newProducts)
  
 
})

app.get('/api/megaSale', async (req, res) => {

  const megaSale = await MegaSale.find({})
  console.log(megaSale);
  res.send(megaSale)
  
 
})


app.get('/api/pointofsale', async (req, res) => {

  const point = await Point.find({})
  console.log(point);
  res.send(point)
  
 
})



app.get('/api/story', async (req, res) => {

  const story = await Story.find({})
  console.log(story);
  res.send(story)
  
 
})







app.get('/images', async (req, res) => {
  const point = await Image.find({})
  console.log(images);
  res.render('images',{
    images
  })
})

// app.get('/', async (req, res) => {
//   const point = await Point.find({})
//   console.log(point);
//   res.render('images',{
//     point
//   })
// })

app.get('/', (req, res) => {
  res.render('adminLogin')
})




app.get('/home', async (req, res) => {
  
  async.concat([Point,MegaSale,NewProducts],function(model,callback) {
    var query = model.find({});
    query.exec(function(err,docs) {
      if (err) throw err;
      callback(err,docs);
    });
  },
  function(err,result) {
    if (err) throw err;

   console.log(result)
    res.render('images',{
      result
   
  
  });
  

  })
})

//==============================================================================================================================================

















//==============================================================================================================================================


app.get('/payment', (req, res) => {
  res.render('payment')
})






app.get('/point', (req, res) => {
  res.render('pointOfsale')
})




app.get('/customerLogin', (req, res) => {
  res.render('customerLogin')
})

app.get('/adminLogin', (req, res) => {
  res.render('adminLogin')
})



app.post('/customer', async(req, res) => {

  const Current_Date =new Date().toJSON().slice(0,10);
  const Username = req.body.username;
  var items=[]
  var mainD=[];
  var productName={}
  var data = await parchaseH.find({Username,Current_Date})
console.log(Username);
  productName=data;
  productName.map((one)=>{
    one.Products.map((item)=>{
      items.push(item)
      
    })    
   
  })
  items.map((one)=>{
    if(one.name !== '' && one.price!== '' && one.barcode!=='') {
      mainD.push(one);
    }
  })
  console.log(mainD)



//get the total


var productName1 = {};
var items1=[];

  const data1 = await parchaseH.find({Username,Current_Date})
  productName1=data1;
  productName1.map((one)=>{
    one.Products.map((item)=>{

      if(item.name !== '' && item.price!== '' && item.barcode!=='')  {

      items1.push(item.price)
      }
    })    
   
  })
  var main = items1.map(v => parseInt(v, 10));
 const total= main.reduce(function(acc, val) { return acc + val; }, 0)









  // res.render('customerCart',mainD)

  res.render('customerCart',{
    mainD,total
  })


})


app.get('/getAl',(req,res)=>{
  parchaseH.find({}).then((data)=>{
    console.log(data)
    res.send(data)
  })
})


app.get('/story', (req, res) => {
  res.render('story')
})



app.get('/sale', (req, res) => {
  res.render('megaSale')
})

app.get('/new', (req, res) => {
  res.render('newlyArrived')
})


app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/dashboard', async(req, res) => {
  const point = await Point.find({})
  console.log(point);
  res.render('dashboard',{
    point
  })
})



app.post('/mega', upload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const product_name = req.body.product_name;
  const product_price=req.body.product_price;
  const product_title=req.body.product_title;
  const product_barcode=req.body.product_barcode;
  const product_details=req.body.product_details;

  console.log(product_name);
  var mega = new MegaSale({
    imageUrl:result.secure_url,
    Product_Name:product_name,
    Product_Price:product_price,
    Product_Title:product_title,
    Product_Barcode:product_barcode,
    Product_Details:product_details
  })
  mega.save()
  .then((url)=>{
    console.log(url);
    res.send(url)
  }).catch(e=>console.log(e))
  // image.imageUrl = result.secure_url;
  // await image.save();
  // res.send({
  //   message: 'Blog is Created'
  // })
  res.redirect("/");
})


app.post('/point', upload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const product_name = req.body.product_name;
  const product_price=req.body.product_price;
  const product_title=req.body.product_title;
  const product_barcode=req.body.product_barcode;
  const product_details=req.body.product_details;
  const product_type=req.body.product_type;

  console.log(product_name);
  var point = new Point({
    imageUrl:result.secure_url,
    Product_Name:product_name,
    Product_Price:product_price,
    Product_Title:product_title,
    Product_Barcode:product_barcode,
    Product_Details:product_details,
    Product_Type:product_type
  })
  point.save()
  .then((url)=>{
    console.log(url);
    res.send(url)
  }).catch(e=>console.log(e))

  res.redirect("/");
})

app.post('/story', upload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const product_name = req.body.product_name;
  const product_price=req.body.product_price;
  const product_title=req.body.product_title;
  const product_barcode=req.body.product_barcode;
  const product_details=req.body.product_details;
  const product_type=req.body.product_type;

  console.log(product_name);
  var story = new Story({
    imageUrl:result.secure_url,
    Product_Name:product_name,
    Product_Price:product_price,
    Product_Title:product_title,
    Product_Barcode:product_barcode,
    Product_Details:product_details,
    Product_Type:product_type
  })
  story.save()
  .then((url)=>{
    console.log(url);
    res.send(url)
  }).catch(e=>console.log(e))
  // image.imageUrl = result.secure_url;
  // await image.save();
  // res.send({
  //   message: 'Blog is Created'
  // })
  res.redirect("/");
})



app.post('/delete', (req, res) => {
  var id = req.body.id;
  Point.findByIdAndRemove(id, function (err, deletedStandUp) {
    // handle any potential errors here
    res.redirect('/dashboard');        
  });
})


app.post('/deleteAll', (req, res) => {

  Point.deleteMany({})
  .then((res)=>{
    console.log(res)
  })
res.redirect('/dashboard')
})

app.post('/new', upload.single('image'), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const product_name = req.body.product_name;
  const product_price=req.body.product_price;
  const product_title=req.body.product_title;
  const product_barcode=req.body.product_barcode;
  const product_details=req.body.product_details;

  console.log(product_name);
  var newproducts = new NewProducts({
    imageUrl:result.secure_url,
    Product_Name:product_name,
    Product_Price:product_price,
    Product_Title:product_title,
    Product_Barcode:product_barcode,
    Product_Details:product_details
  })
  newproducts.save()
  .then((url)=>{
    console.log(url);
    res.send(url)
  }).catch(e=>console.log(e))
  // image.imageUrl = result.secure_url;
  // await image.save();
  // res.send({
  //   message: 'Blog is Created'
  // })
  res.redirect("/");
})


/* =====================================================================================================================================================================
Apriori algorith
=====================================================================================================================================================================*/

app.post('/apriori', async (req, res) => {

  var transactions = [];
  var resultF=[];
  var Username= req.body.username

var productName = {};
var items=[];

  const data = await parchaseH.find({Username})
  productName=data;
  productName.map((one)=>{
    one.Products.map((item)=>{
      if(item.name!='')
      items.push(item.name)
    })    
   
  })
console.log('FIRSTLy',items);

  //console.log('All Items',items);
  var ress = items.reduce((a, c, i) => {
    return i % 2 === 0 ? a.concat([items.slice(i, i + 3)]) : a;
  }, []);

//   while (items.length) {
//     min.push([items.shift(), items.shift()]);
// }
 
transactions=ress;

console.log(transactions)

var apriori = require('./apriori');

var userHistory = ["milk"]

var rec = [];

// Execute Apriori with a minimum support of 40%.
var apriori = new apriori.Apriori(.6);
console.log(`Executing Apriori...`);

// Returns itemsets 'as soon as possible' through events.
apriori.on('data', function (itemset) {
    // Do something with the frequent itemset.
    var support = itemset.support;
    var items = itemset.items;
   // console.log(`Itemset  ${items}  is frequent and have a support of ${support}`);
    rec.push(items);
});




// Execute Apriori on a given set of transactions.
apriori.exec(transactions)
    .then(function (result) {
      // Returns both the collection of frequent itemsets and execution time in millisecond.
      var frequentItemsets = result.itemsets;
      var executionTime = result.executionTime;
      console.log(`Finished executing Apriori. ${frequentItemsets.length} frequent itemsets were found in ${executionTime}ms.`);
  });

  var result = rec.reduce((r, e) => (r.push(...e), r), []);

console.log(userHistory)
// if(result.includes(userHistory[0])) {
//     console.log('yes')
// }
// else{
//     console.log('no')
// }


console.log('------------------');

console.log(result)

result.map((one)=>{
  if(resultF.includes(one)) {

  }
else{
  resultF.push(one)
}

})
  
console.log('final',resultF)

  res.send(resultF)

  })



/* =====================================================================================================================================================================
Apriori algorith
=====================================================================================================================================================================*/





/* =====================================================================================================================================================================
Get the current date and username to store it in cart COMPONENTDIDMOUTN
=====================================================================================================================================================================*/
app.post('/cartfirsttime', async(req,res)=>{


  const current_date = req.body.currentDate;
  const username = req.body.username;
  const email = req.body.email;

  console.log(new Date().toJSON().slice(0,10))
console.log(current_date,username,email)


 var data = new parchaseH({
   Username:username,
   Current_Date:current_date,
   Email:email
 })

 data.save()
  .then((url)=>{
   
        console.log(url);
        res.send(url)
      }).catch(e=>console.log(e))


    })

/* =====================================================================================================================================================================
Get the current date and username to store it in cart COMPONENTDIDMOUTN
=====================================================================================================================================================================*/



/* =====================================================================================================================================================================
GEt the username and store to stories section for the first time
=====================================================================================================================================================================*/
app.post('/storyfirsttime', async(req,res)=>{


 // const current_date = req.body.currentDate;
  const username = req.body.username;
  //const email = req.body.email;


 var data = new Storiesliked({
   Username:username
 })

 data.save()
  .then((url)=>{
   
        console.log(url);
        res.send(url)
      }).catch(e=>console.log(e))


    })

/* =====================================================================================================================================================================
GEt the username and store to stories section for the first time
=====================================================================================================================================================================*/






/* =====================================================================================================================================================================
Store the likes
=====================================================================================================================================================================*/
app.post('/likes', async(req,res)=>{


  //const Current_Date =new Date().toJSON().slice(0,10);
  const Username = req.body.username;
  const Likes=req.body.likes;
console.log(Username,Likes)
var products = {
name: Likes
}

Storiesliked.findOneAndUpdate({Username}, { $push : {Likes: products}})
.then((url)=>{

    console.log(url);
    res.send(url)
  }).catch(e=>console.log(e))


})


/* =====================================================================================================================================================================
Store the likes
=====================================================================================================================================================================*/





/* =====================================================================================================================================================================
Get likes
=====================================================================================================================================================================*/
app.post('/getlike', async(req,res)=>{


  //const Current_Date =new Date().toJSON().slice(0,10);
  const Username = req.body.username;
  
console.log(Username)

var sample={}
const main=[]
const mainRD=[]
const data = await Storiesliked.find({Username})
sample=data

sample.map((one)=>{
  one.Likes.map((item)=>{
    // console.log(item.name);
    if(item.name!=null) {
   main.push(item.name) 
    }
  })    
 
})


main.map((one)=>{
  if(mainRD.includes(one)) {

  }
else{
  mainRD.push(one)
}

})
  
console.log(mainRD)

res.send(mainRD)
})


/* =====================================================================================================================================================================
Get likes
=====================================================================================================================================================================*/






/* =====================================================================================================================================================================
TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
=====================================================================================================================================================================*/

app.get('/tryr',async(req,res)=>{
  const pro=[];
  const pro1=[]
  const all = await parchaseH.find({Username:'jishan'})
 // console.log(all)
 

  all.map((one)=>{
    pro.push(one.Products)
  })


pro.map((two)=>{
  if(two!==undefined && two.length===0){
    two = [""];
 }
  console.log(two)
  pro1.push(two)
})


res.send(pro)
// console.log(pro)
})




/* =====================================================================================================================================================================
TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
=====================================================================================================================================================================*/













/* =====================================================================================================================================================================
Add to cart by getting username, barocde
=====================================================================================================================================================================*/
app.post('/carttoadd', async(req,res)=>{


  const Current_Date =new Date().toJSON().slice(0,10);
  const Username = req.body.username;
  const Product_Barcode = req.body.barcode;
 // const email = req.params.email;


 const fullDetails = await Point.find({Product_Barcode})

console.log(fullDetails);

const productsN=[];
const productsP=[];
const productsB=[];
const productsI=[];



fullDetails.map((oneD)=>{
  productsN.push(oneD.Product_Name);
  productsP.push(oneD.Product_Price);
  productsB.push(oneD.Product_Barcode);
  productsI.push(oneD.imageUrl)
})

// fullDetails.map((twoD)=>{
//   productP.push(twoD.Product_Price);
// })
// fullDetails.map((threeD)=>{
//   productB.push(threeD.Product_Barcode);
// })
// const productsN = fullDetails.Product_Name

// console.log(productsN);

var products = {
name: productsN,
price: productsP,
barcode: productsB,
image:productsI
}

parchaseH.findOneAndUpdate({Username,Current_Date}, { $push : {Products: products}})
.then((url)=>{

    console.log(url);
    res.send(url)
  }).catch(e=>console.log(e))


})

/* =====================================================================================================================================================================
Add to cart by getting username, barocde
=====================================================================================================================================================================*/



/* =====================================================================================================================================================================
whistlist frist time
=====================================================================================================================================================================*/
app.post('/whishlistfirst',(req,res)=>{
    const Username = req.body.username


    var data = {
      Username:Username
    }

    var data = new whishlist({
      Username:Username
    })
   
    data.save()
     .then((url)=>{
      
           console.log(url);
           res.send(url)
         }).catch(e=>console.log(e))
})




/* =====================================================================================================================================================================
whistlist frist time
=====================================================================================================================================================================*/



/* =====================================================================================================================================================================
store whishlist
=====================================================================================================================================================================*/

app.post('/whishlist',(req,res)=>{
const Username = req.body.username
const name = req.body.name
const image = req.body.image
const price = req.body.price

var products = {
  name: name,
  price: price,
  image:image
  }
  
  whishlist.findOneAndUpdate({Username}, { $push : {Products: products}})
  .then((url)=>{
  
      console.log(url);
      res.send(url)
    }).catch(e=>console.log(e))
  


})

app.post('/whishlistG',async(req,res)=>{
  const Username = req.body.username;
  var items=[]
  var mainD=[];
  var productName={}
  var data = await whishlist.find({Username})

  productName=data;
  productName.map((one)=>{
    one.Products.map((item)=>{
      items.push(item)
      
    })    
   
  })


  items.map((one)=>{
    if(one.name !== '' && one.price!== '' && one.image!=='') {
   
      mainD.push(one);
    }
  })

  console.log(mainD)
  res.send(mainD);



})


/* =====================================================================================================================================================================
store whishlist
=====================================================================================================================================================================*/








/* =====================================================================================================================================================================
Get users cart history
=====================================================================================================================================================================*/



app.post('/cartH',async(req,res)=>{

  const Current_Date =new Date().toJSON().slice(0,10);
  const Username = req.body.username;
  var items=[]
  var mainD=[];
  var productName={}
  var data = await parchaseH.find({Username,Current_Date})

  productName=data;
  productName.map((one)=>{
    one.Products.map((item)=>{
      items.push(item)
      
    })    
   
  })


  items.map((one)=>{
    if(one.name !== '' && one.price!== '' && one.barcode!=='') {
      mainD.push(one);
    }
  })

  console.log(mainD)
  res.send(mainD);
  


})

/* =====================================================================================================================================================================
Get users cart history
=====================================================================================================================================================================*/



/* =====================================================================================================================================================================
GEt total amount of users
=====================================================================================================================================================================*/


app.post('/gettotal', async (req, res) => {
  const Current_Date =new Date().toJSON().slice(0,10);
  var transactions = [];

  var Username= req.body.username

var productName = {};
var items=[];

  const data = await parchaseH.find({Username,Current_Date})
  productName=data;
  productName.map((one)=>{
    one.Products.map((item)=>{

      if(item.name !== '' && item.price!== '' && item.barcode!=='')  {

      items.push(item.price)
      }
    })    
  })
  var main = items.map(v => parseInt(v, 10));
 const total= main.reduce(function(acc, val) { return acc + val; }, 0)
console.log(total);
res.json(total);
})




/* =====================================================================================================================================================================
GEt total amount of users
=====================================================================================================================================================================*/








/* =====================================================================================================================================================================
Cross verification
=====================================================================================================================================================================*/
app.post('/verify', async (req, res) => {
  const Current_Date =new Date().toJSON().slice(0,10);
  var transactions = [];

  var Username= req.body.username

var productName = {};
var items=[];

  const data = await parchaseH.find({Username,Current_Date})
  productName=data;
  productName.map((one)=>{
    one.Products.map((item)=>{

      if(item.name !== '' && item.price!== '' && item.barcode!=='')  {

      items.push(item.barcode)
      }
    })    
   
  })



res.send(items);

})



/* =====================================================================================================================================================================
Cross verification
=====================================================================================================================================================================*/


const port = process.env.PORT || 7777
app.listen(port, () => {
  console.log(`Server is running ${port}`)
})

