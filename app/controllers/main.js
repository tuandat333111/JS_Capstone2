
var productservices=new productServices();

function getEle(id){
    return document.getElementById(id);
}
/*
*User Interface
*/

function renderHTML(data){
    var content="";
    data.forEach(function(product){
        content+=`
        <div class="col-12 col-md-6 col-lg-4" >
            <div class="card cardPhone">
                <img src="${product.img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <div>
                        <div>
                            <h3 class="cardPhone__title text-center">${product.name}</h3>
                            <h4 class="cardPhone__title text-center">Giá bán: ${product.price}$</h4>
                        </div>                                
                    </div>
                    <div>
                        <div class="text-dark text-justify">
                            <h5>Thông số cấu hình:</h5>
                            <p>+ Camera trước: ${product.frontCamera}</p>
                            <p>+ Camera sau: ${product.backCamera}</p>
                            <p>+ ${product.desc}</p>
                            <p>+ Loại: ${product.type}</p>
                        </div>                               
                    </div>
                </div>
                <div style="margin:0 auto">
                    <button class="cartbutton" style="width:50px;border-radius:10px;border:1px solid blue;padding:2px;justify-content:center;" onclick="addItemIntoCart('${product.id}','${product.name}','${product.price}')"><i class="fa-solid fa-cart-shopping" style="font-size:16px"></i></button>
                </div>
                
            </div>
            
        </div>
        `;
    });
    let select=getEle("tbproducts");
    if(select){
        select.innerHTML=content;
    } 
    
}

function getProductList(){
    productservices.callAPI("Products","GET",null)
    .then((result) => {
        renderHTML(result.data);            
    })
    .catch((error) => {
        console.log(error);
    });
}
getProductList();

//Filter type
var selectLoai=getEle("selLoai");
if(selectLoai){
    selectLoai.addEventListener("change",function(){
        const option=getEle("selLoai").value;          
        productservices.callAPI("Products","GET",null)
        .then((result)=>{
            const data=result.data;
            let listFilter=data;
            if(option!=="all"){
                listFilter= data.filter((product)=>{
                return product.type===option;            
                })
            }
            renderHTML(listFilter);
        })
        .catch((error)=>{console.log(error);
        });
      });
}
/*
*Admin Interface
*/
function renderAdminHTML(data){
    var contentAdmin="";
    data.forEach(function(product){
        contentAdmin+=`
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.screen}</td>
                <td>${product.backCamera}</td>
                <td>${product.frontCamera}</td>
                <td>
                    <img src="${product.img}" style="width:100px;">
                    <p>${product.img}</p>
                </td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <a class="btn btn-info my-2 text-white" 
                    data-toggle="modal"
                    data-target="#myModal"
                    onclick="editProductButton('${product.id}')"
                    >Edit</a>
                    <a class="btn btn-danger my-2 text-white" onclick="deleteProduct('${product.id}')">Delete</a>
                </td>
            </tr>
        `;
    });
    let select=getEle("tblDanhSachSanPham");
    if(select){
        select.innerHTML=contentAdmin;
    }
    
   
}
function getProductListAdmin(){
    productservices.callAPI("Products","GET",null)
    .then((result) => {
        renderAdminHTML(result.data);            
    })
    .catch((error) => {
        console.log(error);
    });
}
getProductListAdmin();

//Add Product
let selectAddButton=getEle("btnThemSanPham");
if(selectAddButton){
    selectAddButton.addEventListener("click",function(){
        document.getElementsByClassName("modal-title")[0].innerHTML="Thêm sản phẩm";
        getEle("btnCapNhat").style.display="none";
        getEle("btnThem").style.display="inline-block";
        productservices.callAPI("Products","GET",null)
        .then((result) => {        
            getEle("MaSanPham").value=result.data.length+1;            
        })
        .catch((error) => {
            console.log(error);
        });
        
    });
}

function getProductInput(){ 
    var id=getEle("MaSanPham").value*1;   
    var ten=getEle("TenSanPham").value;
    var gia=getEle("GiaBan").value*1;
    var manhinh=getEle("ManHinh").value;
    var camerasau=getEle("CameraSau").value;
    var cameratruoc=getEle("CameraTruoc").value;
    var hinhanh=getEle("HinhAnh").value;
    var mota=getEle("MoTa").value;
    var loai=getEle("loaiSanPham").value;    
     
    var valid=new validation();
    var isValid=true;
    
    isValid&=valid.checkEmpty(ten,"tbTenSanPham","(*)Vui lòng nhập tên sản phẩm");
    isValid&=valid.checkEmpty(gia,"tbGiaBan","(*)Vui lòng nhập giá sản phẩm");
    isValid&=valid.checkEmpty(manhinh,"tbManHinh","(*)Vui lòng nhập kích thước màn hình");
    isValid&=valid.checkEmpty(camerasau,"tbCameraSau","(*)Vui lòng nhập thông số camera sau");
    isValid&=valid.checkEmpty(cameratruoc,"tbCameraTruoc","(*)Vui lòng nhập thông số camera trước");
    isValid&=valid.checkEmpty(hinhanh,"tbHinhAnh","(*)Vui lòng nhập link hình ảnh");
    isValid&=valid.checkEmpty(mota,"tbMoTa","(*)Vui lòng nhập mô tả sản phẩm");
    isValid&=valid.checkChosen("loaiSanPham","tbLoaiSanPham","(*)Vui lòng chọn loại sản phẩm");
    
    if(!isValid) return;
    var item=new product(id,ten,gia,manhinh,camerasau,cameratruoc,hinhanh,mota,loai); 
    return item;
}
let selectAdd=getEle("btnThem");
if(selectAdd){
    selectAdd.addEventListener("click",function(){
        var iteminfo=getProductInput();  
            
       
        if(iteminfo){
            productservices.callAPI("Products","POST",iteminfo)
            .then(function(){
                getProductList();
                getProductListAdmin();
                alert("Add product successfully");
            })
            .catch(function(error){
                console.log(error);
            })
            resetForm();
            document.getElementsByClassName("close")[0].click();
        }
        
        
    })
}

//Delete Product
function deleteProduct(id){    
    productservices.callAPI(`Products/${id}`,"DELETE",null)
    .then(function(){
        getProductList();
        getProductListAdmin();
        alert("Delete product successfully");
        
    })
    .catch(function(error){
        console.log(error);
    })
}
//Reset form
function resetForm(){
    getEle("input-form").reset();
    getEle("tbTenSanPham").innerHTML="";
    getEle("tbGiaBan").innerHTML="";
    getEle("tbManHinh").innerHTML="";
    getEle("tbCameraSau").innerHTML="";
    getEle("tbCameraTruoc").innerHTML="";
    getEle("tbHinhAnh").innerHTML="";
    getEle("tbMoTa").innerHTML="";
    getEle("tbLoaiSanPham").innerHTML="";
}
//Edit product
function editProductButton(id){
    document.getElementsByClassName("modal-title")[0].innerHTML="Sửa sản phẩm";
    getEle("btnThem").style.display="none";
    getEle("btnCapNhat").style.display="inline-block";    
    productservices.callAPI(`Products/${id}`,"GET",null)
    .then(function(result){
        var data=result.data;           
        getEle("MaSanPham").value=data.id;
        getEle("TenSanPham").value=data.name;
        getEle("GiaBan").value=data.price;
        getEle("ManHinh").value=data.screen;
        getEle("CameraSau").value=data.backCamera;
        getEle("CameraTruoc").value=data.frontCamera;
        getEle("HinhAnh").value=data.img;
        getEle("MoTa").value=data.desc;
        getEle("loaiSanPham").value=data.type;
    })
    .catch(function(error){
        console.log(error)
    })
}
let selectUpdate=getEle("btnCapNhat");
if(selectUpdate){
    selectUpdate.addEventListener("click",function(){
        var newitem=getProductInput();
        productservices.callAPI(`Products/${newitem.id}`,"PUT",newitem)
        .then(function(){
            getProductList();
            getProductListAdmin();
            alert("Edit product successfully");
        })
        .catch(function(error){
            console.log(error);
        });
        resetForm();
        document.getElementsByClassName("close")[0].click();
    });
}
let selectLookUp=getEle("keyword");
if(selectLookUp){
    selectLookUp.addEventListener("keyup",async function(){
        var array=[];
        var keyword=getEle("keyword").value;
        await productservices.callAPI("Products","GET",null)   
        .then((result)=>{
            var data=result.data;
            data.forEach((product)=>{
                var nameLowerCase=product.name.toLowerCase();
                var typeLowerCase=product.type.toLowerCase();
                var keywordLowerCase=keyword.toLowerCase();
                if(nameLowerCase.indexOf(keywordLowerCase)!==-1||typeLowerCase.indexOf(keywordLowerCase)!==-1){
                    array.push(product);
                }
            })
        })
        .catch((error)=>{
            console.log(error)
        })
        
        renderAdminHTML(array);
    
    })
}
//Cart Array
var CartArray=new Array();
//Add item into cart array


getLocalStorage();
function setLocalStorage(){
    let datastring=JSON.stringify(CartArray);
    localStorage.setItem("DSGH",datastring);
}
function getLocalStorage(){
    if(localStorage.getItem("DSGH")){
        let data=localStorage.getItem("DSGH");
        CartArray=JSON.parse(data);        
        renderCart(CartArray);
        let showamount=getEle("itemamount");
        let amount=CartArray.length;
        if(showamount){
            if(amount>0){
                showamount.innerHTML=`(${amount})`;
            }            
        }
    }
}

function addItemIntoCart(id,itemname,price){    
    let count=0;  
    for(let i=0;i<CartArray.length;i++){
        if(CartArray[i].Item.id===id){
            CartArray[i].quantity++;
        }
        else{
            count++;
        }
    }    
    console.log(CartArray);
    if(count===CartArray.length){
        let itemc=new item(id,itemname,price); 
        let itemlist=new cartItem(itemc,1); 
        CartArray.push(itemlist);
    }
    setLocalStorage();
    getLocalStorage();
      
} 
    

function renderCart(data){   
    let content="";
    let addCart=getEle("tblProductListCart");
    let getpayment=getEle("payment");
    let gettotalpayment=getEle("totalpayment");
    if(data.length===0) {
        content=`
        <tr>
            <td colspan="6" class="text-center">Không có sản phẩm trong giỏ hàng</td>
        </tr>`;  
    }
    else{
        let total=0;
        if(data){
            data.forEach((item)=>{
                let priceconverted=toCommas(item.Item.price);     
                
                
                content+=`
                    <tr>
                        <td>${item.Item.id}</td>
                        <td>${item.Item.name}</td>
                        <td>${priceconverted}</td>
                        <td>
                            <button onclick="changeQuantity(false,'${item.Item.id}','${item.Item.price}')">-</button>
                            <input id="quantity${item.Item.id}" value="${item.quantity}" oninput="keyInQuantity('${item.Item.id}','${item.Item.price}')" style="width:60px;">
                            <button onclick="changeQuantity(true,'${item.Item.id}','${item.Item.price}')">+</button>
                        </td>
                        <td><span id="total${item.Item.id}">${toCommas(item.Item.price*item.quantity)}</span></td>
                        <td>
                            <button class="btn btn-info" id="update${item.Item.id}" style="display:none" onclick="updateQuantity('${item.Item.id}')">Cập nhật</button>
                            <button class="btn btn-danger" onclick="deteletCartItem('${item.Item.id}')">Xóa</button>
                        </td>
                    </tr>
                `;
                total+=item.Item.price*item.quantity;
                
            });
            content+=`        
            <div>            
                <h3 id="totalpayment">Tổng thanh toán: ${toCommas(total)}</h3>            
                <button id="payment" class="btn btn-info" style="width:200px;padding:20px;font-size:20px;" onclick="payCart()">Thanh toán</button>
            </div>
            `;
            
            
        }
    }
    if(addCart){
        addCart.innerHTML=content;
    }
    
    if(getpayment&&gettotalpayment){
        if(CartArray.length>0){   
            getpayment.style.display="block";     
            gettotalpayment.style.display="block";     
        }
        else{                
            getpayment.style.display="none"; 
            gettotalpayment.style.display="none";                
        }
    }
          
    
}
//Delete Item from Cart
function deteletCartItem(id){         
    for(let i=0;i<CartArray.length;i++){        
        if(CartArray[i].Item.id===id){
            CartArray.splice(i,1);
        }
        
    }    
    setLocalStorage();
    getLocalStorage();
}
//Find Index
function findIndex(id){
    let index=-1;
    for(let i=0;i<CartArray.length;i++){
        if(CartArray[i].Item.id===id){
            index=i;
        }
    }
    return index;
}
//Change Quantity
function changeQuantity(isPlus,id,price){
    let content=0;
    let getValue=getEle(`quantity${id}`);
    let showupdatebutton=getEle(`update${id}`);
    let index=findIndex(id);
    let getTotalPayment=getEle("totalpayment");
    if(getValue&&showupdatebutton){
        let n=getValue.value*1;
        let originalQuantity=CartArray[index].quantity;

        if(isPlus){
            content=n+1;            
            getValue.value=content;
            if(content!==originalQuantity){
                showupdatebutton.style.display="inline-block";
            }
            else{
                showupdatebutton.style.display="none";
            }
            let getTotalValue=getEle(`total${id}`);    
            if(getTotalValue){
                getTotalValue.innerHTML=getValue.value*1*price;
            }
           

        }
        else{     
            content=n-1;                   
            if(content===0){  
                content=1;
                getValue.value=content;
                if(content!==originalQuantity){
                    showupdatebutton.style.display="inline-block";
                }
                else{
                    showupdatebutton.style.display="none";
                }
                let getTotalValue=getEle(`total${id}`);    
                if(getTotalValue){
                getTotalValue.innerHTML=getValue.value*1*price;
            }
                    
                
            }
                
            else if(content>=1){
                getValue.value=content;
                if(content!==originalQuantity){
                    showupdatebutton.style.display="inline-block";
                }
                else{
                    showupdatebutton.style.display="none";
                }
                let getTotalValue=getEle(`total${id}`);    
                if(getTotalValue){
                    getTotalValue.innerHTML=getValue.value*1*price;
                }
            }
        }
        
    }   
}
function keyInQuantity(id,price){
    let showupdatebutton=getEle(`update${id}`);   
    let getValue=getEle(`quantity${id}`); 
    let index=findIndex(id);
    let originalAmount=CartArray[index].quantity;
    console.log(getValue.value===0);
    if(getValue.value*1===0){        
        alert("Vui lòng nhập lại số lượng");
        getValue.value=originalAmount;
    }
    else{
        if(getValue.value*1===originalAmount){
            showupdatebutton.style.display="none";
        }
        else{
            showupdatebutton.style.display="inline-block";  
        }
    }
    let getTotalValue=getEle(`total${id}`);    
    if(getTotalValue){
        getTotalValue.innerHTML=getValue.value*1*price;
    }
  
}
// Update quantity
function updateQuantity(id){
    let index=findIndex(id);
    let getValueQuantity=getEle(`quantity${id}`);
    if(getValueQuantity){
        let valueAmount=getValueQuantity.value*1;
        CartArray[index].quantity=valueAmount;
       
    }
    setLocalStorage();
    getLocalStorage();
}
// Convert to Commas
function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function payCart(){
    for(let i=0;i<CartArray.length;i++){
        CartArray.splice(i,CartArray.length);
    }
    console.log(CartArray);
    setLocalStorage();
    getLocalStorage();
    alert("Thanh toán hoàn tất");

}


