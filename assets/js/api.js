$(document).ready(function()
{  
    var vpoeApps =
    {
	  ModalID : "#myModal",// MODAL ID
      LimitProducts : "250",//  250 MAX PER PAGE By default is 30
      UrlShopify : "myshopname.myshopify.com", // URL SHOPIFY 
      UrlCollection : "/collections/all", // COLLECTION URL TO GET DATA
      ExistsCodeZip : false,
      {% if template contains "collection" %}
      HandleCollection :"{{colection.handle}}",
      {% endif %}
      ProductsJson : "",
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
        var Cookie_Codezip = vpoeApps.Cookie.Read("zipcode");
        
        if( Cookie_Codezip.indexOf("empty") > -1)
        {
          vpoeApps.Products.GetData();
          vpoeApps.modal.Config();
          vpoeApps.modal.Start();
          vpoeApps.modal.Findzip();
          {% if template contains "index" %}          
          {%else%}
          	location.href = vpoeApps.UrlShopify;
          {% endif %}          
        }else
        {
          vpoeApps.Cookie.Set("zipcode",Cookie_Codezip,0.02);
          $(".hed_right ul").append("<li><a href='javascript:void(0)' class='btnapolo changezip'>Change zip code</a></li>")
          {% if template contains "collection" %}
          	var url = window.location.href ;
			if(url.indexOf("collections/") > -1)
            {
              	$(".product_c").hide();
            	if(url.indexOf("zipcode") == -1 )
                {
                  location.href = url+"/zipcode_"+Cookie_Codezip
                }else
                {
                  $(".product_c").show();
                }  
            }
          	vpoeApps.Reset.Codezip();
          {% endif %}
          
        }
        
      },
      Reset : 
  	  {
        Codezip : function()
        {
          $(document).on("click",".changezip",function()
          {
            	console.log("asdsad");
          		vpoeApps.Cookie.Delete("zipcode");
            	location.reload();
          })
        }
      }, 
      modal : 
      {
          Config : function()
          {
            $(vpoeApps.ModalID).modal({
                backdrop: 'static',
                keyboard: false
              });

              //Allow Numbers
            $(vpoeApps.ModalID+" #codezip").keypress(vpoeApps.justNumbers);
          },
          Start : function()
          {
            $(vpoeApps.ModalID).modal("show");
          },
          Close : function()
          {
            $(vpoeApps.ModalID).modal("hide")
          },
          Findzip : function()
          {
            $("#find").on("click",function()
            {
              vpoeApps.ExistsCodeZip = false;
              var Codezip = $("#codezip").val();
              if(Codezip.length > 3)
              {
              	for(var z = 0; z < vpoeApps.ProductsJson.length;z++)
                {
					var Product = vpoeApps.ProductsJson[z];
                  	var TagsArray = Product.tags
                    for(var t = 0 ; t< TagsArray.length; t++)
                    {
                      if(TagsArray[t] =="zipcode_"+Codezip)
                      {
                      	vpoeApps.ExistsCodeZip = true;
                      }  
                    }  
                } 
                if(vpoeApps.ExistsCodeZip)
                {
                  	vpoeApps.Cookie.Create("zipcode",Codezip,0.02)
                   	$(".messageApolo").append("<p>"+vpoeApps.Message.FoundZipcode+"</p>");
                  	var url_redirect = vpoeApps.UrlShopify+vpoeApps.UrlCollection+"/zipcode_"+Codezip;
                  	
                  	$(".messageApolo").show();
                  	location.href = url_redirect;
                }else
                {
                  vpoeApps.Cookie.Create("zipcode","allstate",0.02)
                  $(".messageApolo").append("<p>"+vpoeApps.Message.NotFindZipCode+" , click <a href='"+vpoeApps.UrlShopify+vpoeApps.UrlCollection+"/zipcode_allstate'>here</a></p>");
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
        Template: function(Data)
        {
        	
        },
        GetData : function()
        {           
              var Page =1;
          	  var ProductA = [];
              $.getJSON(vpoeApps.UrlShopify+vpoeApps.UrlCollection+"/products.json?limit="+vpoeApps.LimitProducts+"&page="+Page, function(data) 
              {                  
                  vpoeApps.ProductsJson  = data.products;                
              })              
              .fail(function() 
              {
                  console.log("error");
              });
            	
 
        }
      }
    }
    vpoeApps.init();
});
