(function ($) {
  "use strict";

  $(document).ready(function () {
    // Thumbnail Image Selection
    $(".thumbnail-btn").click(function () {
      let thumbnailImage = $(this).find("img").attr("src");
      $("#mainImage").attr("src", thumbnailImage);
      $(".thumbnail-btn").removeClass("ring-2 ring-indigo-600");
      $(this).addClass("ring-2 ring-indigo-600");
    });

    // Color Selection
    $(".color-btn").click(function () {
      $(".color-btn")
        .removeClass("ring-indigo-600 active")
        .addClass("ring-gray-200");
      $(this).addClass("ring-indigo-600 active");
    });

    // Size Selection
    $(".size-btn").click(function () {
      $(".size-btn")
        .removeClass("border-indigo-600 active")
        .addClass("border-gray-200");
      $(this).addClass("border-indigo-600 active");
    });

    // Accordion Functionality
    $(".accordion-btn").click(function () {
      let content = $(this).next();
      let plusSign = $(this).find("span:last-child");
      content.toggleClass("hidden");
      plusSign.text(content.hasClass("hidden") ? "+" : "−");
    });

    //Gift Wrap
    $(".gift-wrap").click(function () {
      if ($(this).is(":checked")) {
        $(".gift-wrap-form").removeClass("hidden");
        $(".add-to-cart").attr("disabled", "disabled");
      } else {
        $(".gift-wrap-form").addClass("hidden");
        $(".add-to-cart").removeAttr("disabled");
      }
    });

    $(".gift-wrap-form input, .gift-wrap-form textarea").on("input", function() {
      const allFilled = $(".gift-wrap-form input, .gift-wrap-form textarea").toArray().every(function(element) {
        return $(element).val().trim().length > 0;
      }); 
      $(".add-to-cart").prop("disabled", !allFilled);
    });
  });
})(jQuery);
