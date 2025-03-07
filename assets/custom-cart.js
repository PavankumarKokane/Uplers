let isCartOpen = false;
let shopifyLocale = Shopify.locale.split("-")[0];
let localeCountry = `${shopifyLocale}-${Shopify.country}`;
const shopCurrency = Shopify.currency.active;
const site_url = window.location.origin;

async function add_to_cart(item, quantity, type) {
  if (type == "buy_now") {
    clearCart(item, quantity, type);
  } else {
    add_product(item, quantity, type);
  }
}

async function clearCart(item, quantity, type) {
  fetch("/cart/clear.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        //onBuyNowClickMagic(event);
        console.log("Cart cleared successfully!");
        add_product(item, quantity, type);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function add_product(item, quantity, type) {
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item,
        quantity: quantity,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (type == "buy_now") {
        window.location.href = "/checkout";
        //openRzpCheckout(event);
      } else {
        $("#cart_drawer").addClass("active");
        dropdowncart();
      }
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      alert("There was an error adding the product to the cart.");
    });
}

async function add_note(note) {
  fetch("/cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      note: note
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error adding to note:", error);
  });
}

function currencyES6Format(money) {
  let formattedMoney = new Intl.NumberFormat(localeCountry, {
    style: "currency",
    currency: shopCurrency,
    minimumFractionDigits: 0, // Set minimum fraction digits to 0
    maximumFractionDigits: 2, // Allow up to 2 decimal places
  }).format(money);

  // Remove '.00' if it exists
  if (formattedMoney.endsWith(".00")) {
    formattedMoney = formattedMoney.slice(0, -3);
  }

  return formattedMoney;
}
var hostname = window.location.hostname;
var link = `https://${hostname}/cart.json`;

async function getData() {
  let x = await fetch(link);
  const data = await x.json();
  return data;
}

var dropdowncart = () => {
  isCartOpen = true;
  $("body").css("overflow", "hidden");
  //$(".checkout_btn").text("Proceed To Checkout");
  $("#cart_drawer").addClass("loader");

  getData().then((data) => {
    $("#cart_drawer").removeClass("loader");
    var item_count = data["item_count"];
    var total_price = data["total_price"] / 100;
    var original_total_price = data["original_total_price"] / 100;
    var product_count = data["items"].length;

    $("#cart_item_count").html(
      "<span>(" + item_count + ")</span> Items in Bag"
    );
    $("#mini_cart_total").text(currencyES6Format(original_total_price));
    $("#mini_cart_subtotal").text(currencyES6Format(total_price));
    $(".cart-count").text(item_count);
    var discount = original_total_price - total_price;
    var discount_percent = (discount / original_total_price) * 100;

    if (discount > 0) {
      $(".minitotal .discount").show();
    } else {
      $(".minitotal .discount").hide();
      $(".minitotal .totalname").hide();
    }
    $("#mini_cart_discount").text(
      "- " +
        currencyES6Format(Math.round(discount)) +
        " (" +
        Math.round(discount_percent) +
        "%)"
    );

    if (item_count > 0) {
      $(".minitotal.total,.sd_sidebar_check").show();
      $(".product-outer").find("div").remove();

      for (var i = 0; i < product_count; i++) {
        var item_id = data["items"][i]["id"];
        var product_title = data["items"][i]["product_title"];
        var product_handle = data["items"][i]["handle"];
        var quantity = data["items"][i]["quantity"];
        var price = data["items"][i]["line_price"] / 100;
        var line_price = price > 0 ? currencyES6Format(price) : "Free";
        var url = data["items"][i]["url"];
        var image_url = data["items"][i]["image"];
        var variants = data["items"][i]["variant_options"];
        var variants_key = data["items"][i]["key"];

        //console.log(variants);
        var variant_title = data["items"][i]["variant_title"];
        //console.log(variant_title);
        if (variant_title == null) {
          variant_title = "";
        }

        $(".product-outer").append(
          $(
            '<div class="product-inner row mini-cart-product" id="' +
              item_id +
              '"><img class="removeproduct remove" src="https://cdn.shopify.com/s/files/1/0638/2321/6794/files/close.png" id="' +
              item_id +
              '" linekey="' +
              variants_key +
              '" height="10" width="10"><div class="product_image image"><a href="' +
              site_url +
              "/products/" +
              product_handle +
              '"><img loading="lazy" src="' +
              image_url +
              '" height="165" width="165" alt="' +
              product_title +
              '"></a></div><div class="pro-content" id="pro-content"><div class="cartproname prohead"><a href="' +
              site_url +
              "/products/" +
              product_handle +
              '"><h3 class="product_title m-0">' +
              product_title +
              '</h3></a><div class="prd_variant_style">' +
              variant_title +
              '</div></div><div class="pro-quantity"><div class="quantity-selector"><div><span class="price product_price" id="product_price"><span class="current_price">' +
              line_price +
              '</span></span></div><div><span class="quantitybox"><button type="button" class="sd_altera sminus">-</button><input type="text" readonly="" id="updatequant" name="updatequant" value="' +
              quantity +
              '" proid="' +
              item_id +
              '" prokey="0" linekey="' +
              variants_key +
              '"><button type="button" class="sd_altera splus down">+</button></span></div></div></div></div></div>'
          )
        );
      }
      $(".cart-dis-txt").show();
    } else {
      $("#cart_item_count").html("<span>(0)</span> Items in Bag");
      $(".cart-dis-txt").hide();
      $(".product-outer").html(
        $(
          '<div class="cart-item-container"><div class="media-body empty-media"><figure><img src="https://cdn.shopify.com/s/files/1/0638/2321/6794/files/empty-cart.webp" alt="empty-cart"></figure><h3 class="row mini-cart-product">Add items to bag now</h3></div><div class="bottom-cart-box"><div class="cart-btn-container"></div></div></div>'
        )
      );
      $(".minitotal.total,.sd_sidebar_check").hide();
    }
  });
};

var update_header_cart = () => {
  getData().then((data) => {
    var item_count = data["item_count"];
    $(".cart-count").html(item_count);
  });
};
update_header_cart();

$(".cart-icon").on("click", function (e) {
  e.preventDefault();
  dropdowncart();
  $("#cart_drawer").addClass("active");
});

var incr_cart = (proid, inc) => {
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    dataType: "json",
    data: {
      id: parseFloat(proid),
      quantity: 1,
    },
  }).then((data) => {
    dropdowncart();
  });
};
var dec_cart = (proid, linekey, dec) => {
  $.ajax({
    type: "POST",
    url: "/cart/change.js",
    dataType: "json",
    data: {
      id: linekey,
      quantity: dec,
    },
  }).then((data) => {
    dropdowncart();
  });
};

var removecart = (new_id, id_key) => {
  $.ajax({
    type: "POST",
    url: "/cart/change.js",
    dataType: "json",
    data: {
      id: id_key,
      quantity: 0,
    },
  }).then((data) => {
    dropdowncart();
  });
};

$(document).on("click", ".remove", function (e) {
  console.log("clicked");
  e.preventDefault();
  let product_id = this.id;
  let product_key = $(this).attr("linekey");
  console.log(product_id + "test" + product_key);
  $(this).parents(".product-inner").remove();
  removecart(product_id, product_key);
});

$(document).on("click", ".splus", function () {
  var upinput = $(this).parents(".quantitybox").find("input").val();
  var inc = parseInt(upinput) + 1;
  $(this).parents(".quantitybox").find("input").val(inc);
  var inc_id = $(this).parents(".quantitybox").find("input").attr("proid");
  incr_cart(inc_id, inc);
});

$(document).on("click", ".sminus", function () {
  var upinput = $(this).parents(".quantitybox").find("input").val();
  var dec = parseInt(upinput) - 1;
  var dec_id = $(this).parents(".quantitybox").find("input").attr("proid");
  var linekey = $(this).parents(".quantitybox").find("input").attr("linekey");
  $(this).parents(".quantitybox").find("input").val(dec);
  dec_cart(dec_id, linekey, dec);
});

$(document).on("click", ".sides_cross_image", function (e) {
  $("#cart_drawer").removeClass("active");
  $("body").css("overflow", "auto");
});

document.addEventListener("click", function (event) {
  //console.log("DOM Clicked " + isCartOpen);
  if (!isCartOpen) {
    if (
      !$(event.target).closest(".custom-cart").length &&
      !$(event.target).hasClass("removeproduct")
    ) {
      isCartOpen = false;
      $("body").css("overflow", "auto");
      $("#cart_drawer").removeClass("active");
    }
  }
  isCartOpen = false;
});

$("body").append(
  '<div id="cart_drawer" class="cart_drawer"><div class="custom-cart"><div class="custom-cart-loader"></div><div class="title-close-wrapper"><div class="productbox" id="productbox"><h3 class="heading" id="cart_item_count"><span>(0)</span>Items in your cart</h3></div><div class="sides_cross_image"><img loading="lazy" src="https://cdn.shopify.com/s/files/1/0638/2321/6794/files/close.svg" height="30" width="30" alt="close logo"></div></div><form action="/cart" method="post" class="custom_cartform" name="cartform"><div class="product-outer"></div></form><div class="cart-total-box"><div class="minitotal total"><div class="details-cart">Order Details</div><div class="totalname">Total<strong id="mini_cart_total" class="totalprice">₹0,00,00</strong></div><div class="discount">Discount<strong id="mini_cart_discount" class="totalprice">₹0,00,00</strong></div><div class="subtotal">Subtotal</div><div class="sd_sidebar_check"><p class="mini_cart_subtotal"><span id="mini_cart_subtotal">₹0,00,00</span><span>(incl. of All taxes)</span></p><input id="sd_valid_discount" type="hidden" name="discount"><button onclick="openRzpCheckout(event)" class="checkout_btn magicbutton">Checkout</button></div></div></div></div></div>'
);

$(document).on("click", ".checkout_btn", function () {
  window.location = "/checkout";
});
