	<!-- include plugins -->
 {% if settings.product_grid_layout == '4-col' %}
{% assign grid_item_width = '3' %}
{% elsif settings.product_grid_layout == '3-col' %}
{% assign grid_item_width = '4' %}
{% else %}
{% assign grid_item_width = '6' %}
{% endif %}


{{ 'bootstrap.min.css' | asset_url | stylesheet_tag }}
{{ 'bootstrap.min.js' | asset_url | script_tag }}

<!-- HTML -->

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="headermodal">
        	<h3> PLEASE ENTER YOUR POST CODE</h3>
        </div>
        <div class="bodymodal">
          <input type="text" class="" id="codezip" style="margin-bottom:15px" /> <span class="btn" id="find"  style="margin-bottom:15px" >Find</span>
          <div class="messageApolo" style="display:none">
          
          </div>
          <br/>
          <div >
            <p>
              We need your post code to show you the product that are available in your area
            </p>
          </div>
        </div>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->


<!-- JAVASCRIPT -->
<script>
  
$(document).ready(function()
{  
    var ApoloApps =
    {
	  ModalID : "#myModal",// MODAL ID
      LimitProducts : "250",//  250 MAX PER PAGE By default is 30
      UrlShopify : "{{shop.url}}", // URL SHOPIFY 
      UrlCollection : "/collections/all", // COLLECTION URL TO GET DATA
      ExistsCodeZip : false,
      {% if template contains "collection" %}
      HandleCollection :"{{colection.handle}}",
      {% endif %}
      ProductsJson : "",
      ProductsAllArea : "",
      LenghtProductoShow : "",
      Page : 1,
      LimitProduct : 15,
      ProductsShow :0,
      JoinProducts : false,
      Message :
      {
        ErroZip : "" ,
      	NotFindZipCode : "There are no specific products for this area code but you can see the ones available for all areas",
      	FoundZipcode  : "Area code found, you will be taken....."
      },
      init : function()
      {        
        // GETTING PRODUCTS        
        // READ COOKIES  IF EXISTS  ZIPCODE
        var Cookie_Codezip = ApoloApps.Cookie.Read("postcode");
        
        if( Cookie_Codezip.indexOf("empty") > -1)
        {
          ApoloApps.Products.GetData();
          ApoloApps.modal.Config();
          ApoloApps.modal.Start();
          ApoloApps.modal.Findzip();
          {% if template contains "index" %}          
          {%else%}
          	location.href = ApoloApps.UrlShopify;
          {% endif %}          
        }else
        {
            ApoloApps.Cookie.Set("postcode",Cookie_Codezip,0.02);
          
            $(".hed_right ul").append("<li><a href='javascript:void(0)' class='btnapolo changezip'>Change to PostCode</a></li>");
            {% if template contains "collection" %}
              var url = window.location.href ;
              if(url.indexOf("collections/") > -1)
              {
                  $(".product_c").hide();
                  if(url.indexOf("postcode") == -1 )
                  {
                    location.href = url+"/postcode_"+Cookie_Codezip
                  }else
                  {
                    $(".product_c").show();   
                    if(Cookie_Codezip != "0000")
                    {                      
                      	var ProductAllArea = [];                        
      
                                    var Page =1;
                        var ProductA = [];
                        $.getJSON(ApoloApps.UrlShopify+ApoloApps.UrlCollection+"/products.json?limit="+ApoloApps.LimitProducts+"&page="+Page, function(data) 
                        {                  
                            ApoloApps.ProductsJson  = data.products;
                            for(var z = 0; z < ApoloApps.ProductsJson.length;z++)
                            {
                                var Product = ApoloApps.ProductsJson[z];
                                var TagsArray = Product.tags
                                var IsAllArea = false;
                                for(var t = 0 ; t< TagsArray.length; t++)
                                {      
                                  if(TagsArray[t].toLowerCase() == "postcode_0000")
                                  {
                                    IsAllArea = true;
                                  }                        
                                }
                                if(IsAllArea)
                                {
                                  ProductAllArea.push(Product)
                                }  
                            } 
                        	ApoloApps.ProductsAllArea = ProductAllArea;
                          	ApoloApps.Products.AddProducts(ApoloApps.ProductsAllArea,ApoloApps.Page);
                          ApoloApps.PaginateApolo();
                        })              
                        .fail(function() 
                        {
                            console.log("error");
                        });

                      	
                  	}
                  }  
              }

            {% endif %}
            ApoloApps.Products.FormtarUrlCollections("postcode_"+Cookie_Codezip);          
          	ApoloApps.Reset.Codezip();
        }
        
      },
      Reset : 
  	  {
        Codezip : function()
        {
          $(document).on("click",".changezip",function()
          {
            	ApoloApps.Cookie.Delete("postcode");
            	location.reload();
          })
        }
      }, 
      modal : 
      {
          Config : function()
          {
            $(ApoloApps.ModalID).modal({
                backdrop: 'static',
                keyboard: false
              });

              //Allow Numbers
            $(ApoloApps.ModalID+" #codezip").keypress(ApoloApps.justNumbers);
          },
          Start : function()
          {
            $(ApoloApps.ModalID).modal("show");
          },
          Close : function()
          {
            $(ApoloApps.ModalID).modal("hide")
          },
          Findzip : function()
          {
            $("#find").on("click",function()
            {
              ApoloApps.ExistsCodeZip = false;
              var Codezip = $("#codezip").val();
              if(Codezip.length > 3)
              {
                var ProductAllArea = [];
              	for(var z = 0; z < ApoloApps.ProductsJson.length;z++)
                {
					var Product = ApoloApps.ProductsJson[z];
                  	var TagsArray = Product.tags
                    var IsAllArea = false
                    for(var t = 0 ; t< TagsArray.length; t++)
                    {
                      if(TagsArray[t].toLowerCase() =="postcode_"+Codezip)
                      {
                      	ApoloApps.ExistsCodeZip = true;
                      }  
                                           
                    }
                  	
                } 
                if(ApoloApps.ExistsCodeZip)
                {
                  	ApoloApps.Cookie.Create("postcode",Codezip,0.02)
                   	$(".messageApolo").append("<p>"+ApoloApps.Message.FoundZipcode+"</p>");
                  	var url_redirect = ApoloApps.UrlShopify+ApoloApps.UrlCollection+"/postcode_"+Codezip;
                  	
                  	$(".messageApolo").show();
                  	location.href = url_redirect;
                }else
                {
                  ApoloApps.Cookie.Create("postcode","0000",0.02)
                  $(".messageApolo").append("<p>"+ApoloApps.Message.NotFindZipCode+" , click <a href='"+ApoloApps.UrlShopify+ApoloApps.UrlCollection+"/postcode_0000'>here</a></p>");
                  $(".messageApolo").show();
                } 
              }else
              {
              
              }
            });
          }
      },
      justNumbers:  function (e)
      {
        var keynum = window.event ? window.event.keyCode : e.which;
        if ((keynum == 8) || (keynum == 46))
        return true;
         
        return /\d/.test(String.fromCharCode(keynum));
      },
      Cookie : 
  	  {
      	  Create : function (key, value,exdays) 
          {
              expires = new Date();
              expires.setTime(expires.getTime()+ (exdays*24*60*60*1000));
              cookie = key + "=" + value + ";expires=" + expires.toUTCString()+";path=/";
              return document.cookie = cookie;
          },
          Read : function (key) 
          {
              keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
              if (keyValue)
              {
                  return keyValue[2];
              }
                else
              {
                   return "empty";
              }
          },
          Set :function (cname,cvalue,exdays) 
          {
              var d = new Date();
              d.setTime(d.getTime() + (exdays*24*60*60*1000));
              var expires = "expires=" + d.toGMTString();
              document.cookie = cname+"="+cvalue+"; "+expires+";path=/";
          },
          Delete :function(cname)
          {
              expires = new Date();
              expires.setTime(expires.getTime()+ (-1*24*60*60*1000));
              cookie = cname + "=;expires="+expires.toUTCString()+";path=/";
              return document.cookie = cookie;
          }
      },       
      Products : 
  	  {
        AddProducts : function(Data,page)
        {
            var Template  = "";
              var LengthProduct = $(".row.view-grid > div").length;
              var LimitAllStateProduct = 3;
              var Url= window.location.href;
              var Page = page;
              var Start = 0;
              if(Url.indexOf("page") > -1)
              {
                var UrlSplit = Url.split("?");
                var PageSplit	= UrlSplit[1].split("=");
                Page = PageSplit[1];
              }
              if((parseInt(LengthProduct+LimitAllStateProduct)) == ApoloApps.LimitProduct)
              {
                if(Page > 1)
                {

                    LimitAllStateProduct = LimitAllStateProduct * Page;
                    Start = (LimitAllStateProduct-3);
                    if(LimitAllStateProduct > Data.length)
                    {
                        LimitAllStateProduct = Data.length;
                    }  
                }  


              }else
              {
                 LimitAllStateProduct =ApoloApps.LimitProduct - LengthProduct;            
                 if(LimitAllStateProduct > Data.length)
                 {
                   LimitAllStateProduct = Data.length;
                 }
                    else
                 {
                   var MaxPage = Data.length - LimitAllStateProduct;
                   var CeilVal = MaxPage / ApoloApps.LimitProduct;
                   ApoloApps.Products.Paginate(CeilVal)

                 }

              } 
              ApoloApps.Page = Page;
              if(Start < Data.length)
              {
                ApoloApps.Products.Template(Start,LimitAllStateProduct);
              }
        },
        Template: function(Start,LimitAllStateProduct)
        {          

          var Template  = ""; 
          console.log(LimitAllStateProduct);
              for(var e=Start;e < LimitAllStateProduct;e++)
              {    
                var Product = ApoloApps.ProductsAllArea[e];

                var OnSale = false;
                var SoldOut = true;
                var purl = ApoloApps.UrlShopify+"/products/"+Product.handle;  
                var ProductAvailable = false;  
				ApoloApps.ProductsShow =ApoloApps.ProductsShow+1;
                for(var z = 0; z < Product.variants.length;z++)
                {
                    if(Product.variants[z].available)
                    {
                        ProductAvailable = true;
                    }
                }  
                Template=Template+ '<div class="col-md-{{ grid_item_width }} col-xs-6 element mb30">';
                  Template =Template+ '<div class="main_box">';          
                      Template = Template+ '<div class="box_1">';
                        if(OnSale)
                        {                    
                            Template =Template+'<div class="on-sale">{{ "products.product.sale" | t }}</div>';
                        }                       
                        if(!ProductAvailable)
                        {
                          Template =Template+'<div class="sold-out">{{ "products.product.sold_out" | t }}</div>';
                        }                      

                        Template =Template+'<div class="product-image">';
                            Template =Template+'<a href="'+purl+'">';
                                if(Product.images.length > 0)
                                {  
                                  if(Product.images[0].src)
                                  {
                                    	  Template =Template+'<img src="'+Product.images[0].src+'" />';                              
                                  }else
                                  {
                                      Template =Template+'<img src="'+Product.images[0]+'" />';                              
                                  }  
                                  
                                }else
                                {
                                  Template =Template+'<img src="//cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c_large.gif" >';
                                } 
                            Template =Template+'</a>';
                        Template =Template+'</div>';
                          Template =Template+'<form method="post" action="/cart/add">';

                              Template  =Template+'<input type="hidden" name="id" value="'+Product.variants[0].id+'" />';
                              Template  =Template+ '<div class="overlay hidden-sm hidden-xs">';
                                 if(Product.variants.length == 1 && ProductAvailable)
                                 {
                                    Template =Template+ '<input type="submit" value="{{ 'products.product.add_to_cart' | t }}" class="btn_c cart_btn_1" /> ' ;
                                    Template = Template+' <a href="'+purl+'" class="info_btn">{{ 'products.product.more_info' | t }}</a>';
                                 } else
                                 {
                                    Template = Template+'<a href="'+purl+'" class="btn_c more_btn">{{ 'products.product.select_options' | t }}</a>';
                                 } 

                              Template  =Template+ '</div>';
                          Template =Template+  '</form>';         		  
                      Template =Template+  '</div>';
                      Template = Template+'<div class="desc">';
                          Template = Template+'<h5>';
                              Template = Template +'<a href="'+purl+'">'+Product.title+'</a>';
                          Template = Template+'</h5>';
                          {% if settings.show_grid_type %}
                              Template = Template+'<p>'+Product.product_type+'</p>';
                          {% endif %}
                          Template = Template+'<div class="price">';            /*
                              Template = Template+'<span class="compare-price">';
                              Template = Template+'</span>';*/
                              Template = Template+'$'+Product.variants[0].price;
                          Template = Template+'</div>';
                      Template = Template+'</div>';
                  Template =Template+  '</div>';
                Template =Template+ '</div>';
              }          
          $(".product_c > .row.view-grid").append(Template)
          $('.element').responsiveEqualHeightGrid();
        },
        GetData : function()
        {           
              var Page =1;
          	  var ProductA = [];
              $.getJSON(ApoloApps.UrlShopify+ApoloApps.UrlCollection+"/products.json?limit="+ApoloApps.LimitProducts+"&page="+Page, function(data) 
              {                  
                  ApoloApps.ProductsJson  = data.products;                
              })              
              .fail(function() 
              {
                  console.log("error");
              });
            	
 
        },
        FormtarUrlCollections : function(zipcode)
        {
          	$(".dropdown-menu li a").each(function()
            {
              	var hrefVal = $(this).attr("href");              
              	if(hrefVal.indexOf("/collections/") > -1)
                {                  
                	$(this).attr("href",hrefVal+"/"+zipcode)
                }  
            });
        },
        Paginate:function(max)
        {
          var Paginate  = "";
          
          Paginate =Paginate+'<div class="page_c clearfix red5">';
            if(ApoloApps.Page  === 1)
            {
            	Paginate =Paginate+ '<a href="" class="prev disabled"><span class="fa fa-chevron-left"></span>{{ 'collections.general.previous' | t }}</a>';
            }else
            {
            	Paginate =Paginate+ '<a href="#pg='+(ApoloApps.Page-1)+'" class="prev ApoloPag"><span class="fa fa-chevron-left"></span>{{ 'collections.general.previous' | t }}</a>';
            }           	
            
            Paginate =Paginate+ '<ul>';
            for(var g =0; g < (max+1);g++)
            {            
                
				if(ApoloApps.Page == (g+1))
                {
                	Paginate =Paginate+ '<li class="active"><a class="ApoloPag" href="#pg='+(g+1)+'">'+(g+1)+'</a></li>';
                }else
                {
                  	Paginate =Paginate+  '<li>';
                 		Paginate =Paginate+ '<a  class="ApoloPag" href="#pg='+(g+1)+'" title="">'+(g+1)+'</a>';
                	Paginate =Paginate+ '</li>';
                } 
            }
            Paginate =Paginate+ '</ul>';
            if(ApoloApps.Page < (max+1) )
            {
              Paginate =Paginate+ '<a href="#pg='+(ApoloApps.Page+1)+'" title="" class="next ApoloPag">{{ 'collections.general.next' | t }}<span class="fa fa-chevron-right"></span></a>';
            }else
            {
              	Paginate =Paginate+ '<a href="" class="next disabled">{{ 'collections.general.next' | t }}<span class="fa fa-chevron-right"></span></a>';
            }  
           
            
           
            
          Paginate=Paginate+'</div>';
          $(".page_c").remove();
          $(".product_c").append(Paginate)
          
        }

      },
      PaginateApolo : function()
  	 {
       	$(document).on("click",".ApoloPag",function()
        {
          if(ApoloApps.JoinProducts === false)
          {
          	var NewProducts = [];
            for(var pk =0; pk < ProductJson.length ; pk++)
            {
            	NewProducts.push(ProductJson[pk])
            }
            for(var pk =0; pk < ApoloApps.ProductsAllArea.length ; pk++)
            {
            	NewProducts.push(ApoloApps.ProductsAllArea[pk])
            } 
            ApoloApps.ProductsAllArea = NewProducts;
            ApoloApps.JoinProducts = true;
          }
          console.log(ApoloApps.ProductsAllArea);
          	var href= $(this).attr("href");
          	var urlS = window.location.href;			
            	var urlA = href.split("#pg=");    
              $(".product_c > .row.view-grid > div").remove();
                var LimitA = urlA[1]* ApoloApps.LimitProduct;
              	var Start = LimitA -ApoloApps.LimitProduct ;
              	if(LimitA > ApoloApps.ProductsAllArea.length)
                {
                	ApoloApps.Products.Template(Start,ApoloApps.ProductsAllArea.length);
                }else
                {
                	ApoloApps.Products.Template(Start,LimitA);
                }   
       
              	
             
          	
          	
        });
     }
    }
    ApoloApps.init();
});
</script>
