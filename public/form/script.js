(function (window, undefined) {
  window.A7 = window.A7 || {};

  window.A7.landRegistration = {
    init: function() {

      var regForm = $('.js-reg-form'),
          regionSelectVal = null;


      // name data block
      var nameBlock = {
        validateBlock: function(dataBlock) {
          var dataBlockInput = dataBlock.find('input[type="text"]'),
            dataBlockVal,
            regExp = /[;":*&%'!?$#№_@^|,./()=+0-9]/;

          dataBlockInput.on('keyup change', function() {
            dataBlockVal = dataBlockInput.val();
            dataBlock.removeClass('is-format is-symbol is-empty');
            if ( regExp.test( dataBlockVal ) ) {
              dataBlock.addClass('is-symbol');
            } else {
              dataBlock.removeClass('is-symbol');
            }
          });
        }, checkState: function(dataBlock) {
          var dataBlockInput = dataBlock.find('input[type="text"]'),
              dataBlockVal = dataBlockInput.val();

          if ( dataBlockVal === '' ) {
            dataBlock.addClass('is-empty');
            return false;
          } else if ( dataBlock.is('.is-format, .is-symbol') ) {
            return false;
          }
        }
      };


      // date data block
      var dateBlock = {
        initBlock: function(dataBlock) {
          dataBlock.find('select').selectOrDie({
            cycle: true,
            size: 5,
            onChange: function () {
              dataBlock.removeClass('is-empty');
              $(this).addClass('is-changed');
            }
          });
        }, checkState: function(dataBlock) {
          var dateIsFull;
          dataBlock.find('select').each(function() {
            if ( !$(this).is('.is-changed') ) {
              dataBlock.addClass('is-empty');
              dateIsFull = false;
            }
          });
          return dateIsFull;
        }
      };


      // phone data block
      var phoneBlock = {
        initBlock: function (dataBlock) {
          var phoneNumPrefix = { "au": "0061", "at": "0043", "az": "00994", "al": "00355", "dz": "00213", "ad": "00376", "ar": "0054", "am": "00374", "af": "0093", "bs": "001242", "by": "00375",
              "be": "0032", "bg": "00359", "br": "0055", "va": "003906682", "gb": "0044", "hu": "0036", "vn": "0084", "de": "0049", "gi": "00350", "hk": "00852", "gl": "00299", "gr": "0030",
              "ge": "00995", "dk": "0045", "do": "001", "eg": "0020", "il": "00972", "in": "0091", "id": "0062", "jo": "00962", "iq": "964", "ir": "098", "ie": "00353", "is": "00354", "es": "0034",
              "it": "0039", "kz": "007", "ca": "001", "cy": "00357", "kg": "00996", "cn": "0086", "la": "00856", "lv": "00371", "lb": "00961", "lt": "00370", "li": "00423", "lu": "00352", "mu": "00230",
              "mk": "00389", "my": "0060", "ml": "00223", "mv": "00960", "mt": "00356", "ma": "00212", "mx": "0052", "md": "00373", "mc": "00377", "mn": "00976", "an": "00599", "nl": "0031", "nz": "0064",
              "no": "0047", "ae": "00971", "pl": "0048", "pt": "00351", "ru": "007", "ro": "0040", "sv": "00503", "rs": "00381", "sg": "0065", "sk": "00421", "si": "00386", "us": "001", "tj": "00992",
              "th": "0066", "tn": "00216", "tm": "00993", "tr": "0090", "uz": "00998", "ua": "00380", "fi": "00358", "fr": "0033", "gf": "00594", "hr": "00385", "cz": "00420", "ch": "0041", "se": "0046",
              "ec": "00593", "ee": "00372", "za": "0027", "jm": "001876", "jp": "0081" },
            select = $('[name="country"]');

          // init phone SOD select
          $(".js-region").selectOrDie({
            cycle: true,
            onChange: function () {
              regionSelectVal = $(this).val();
              getIt();
            }
          });

          // set select list width
          function setSelectListWidth(parentBlock) {
            var parentBlockWidth = parentBlock.width(),
                setWidth = function() {
                  parentBlock.find('.sod_list_wrapper').css('width', parentBlockWidth);
                };

            setWidth();
            $(window).on('resize', function() {
              parentBlockWidth = parentBlock.width();
              setWidth();
            });
          }

          setSelectListWidth( $('.js-number-block') );
          regionSelectVal = $('.js-region-select .selected').attr('data-value');

          function getPrefix() {
            return '+' + phoneNumPrefix[regionSelectVal].replace(/^(00)/, '') + ' ';
          }

          function maskPhone() {
            $('.js-number').unmask();

            if ( regionSelectVal === 'ru' ) {
              $('.js-number').mask("+7(999) 999-99-99");
            } else if ( regionSelectVal === 'kz' ) {
              $('.js-number').mask("+7(999) 999-99-99");
            } else if ( regionSelectVal === 'ua' ) {
              $('.js-number').mask("+380(99) 999-99-99");
            } else if ( regionSelectVal === 'by' ) {
              $('.js-number').mask("+375(99) 999-99-99");
            }
          }

          function getIt() {
            maskPhone();
            $('.js-region-select .sod_label').html('<img src="https://astro7.ru/fileadmin/templates/images/flags/' + regionSelectVal + '.png" width="16" height="11" alt="">');
            $('.js-number').val( getPrefix() ).focus();
            dataBlock.removeClass('is-empty');
          }

          // show hidden region block
          $('.js-number').on('click focus', function() {
            if ( !dataBlock.hasClass('is-active') ) {
              dataBlock.addClass('is-active');
              getIt();
            }
          });

          // stylize main countries select area
          $('.sod_option[data-value="au"]').addClass('sod_option--last');
        
        }, validateBlock: function(dataBlock) {
          var dataBlockInput = dataBlock.find('input[type="tel"]'),
            dataBlockVal,
            regExp = /[\.;/|—":*&%'!?$#№@^=a-zA-Zа-яА-Я]/;

          dataBlockInput.on('keyup change', function() {
            dataBlockVal = dataBlockInput.val();
            dataBlock.removeClass('is-format is-symbol is-clear');
            if ( regExp.test( dataBlockVal ) ) {
              dataBlock.addClass('is-symbol');
            } else {
              dataBlock.removeClass('is-symbol');
            }
          });
        }, checkState: function(dataBlock) {
          var dataBlockInput = dataBlock.find('input[type="tel"]'),
              dataBlockVal = dataBlockInput.val();

          if ( dataBlockVal === '' ) {
            dataBlock.addClass('is-empty');
            return false;
          } else if ( dataBlockVal.length < 10 && !dataBlock.is('.is-symbol') ) {
            dataBlock.addClass('is-format');
            return false;
          } else if ( dataBlock.is('.is-format, .is-symbol') ) {
            return false;
          }
        }
      };


      // email data block
      var emailBlock = {
        validateBlock: function(dataBlock) {
          var dataBlockInput = dataBlock.find('input[type="text"]'),
              dataBlockVal,
              regExp = /[\;":*&%'!?$#№^()=+а-яА-Я]/;

          dataBlockInput.on('keyup change', function() {
            dataBlockVal = dataBlockInput.val();
            dataBlock.removeClass('is-format is-symbol is-empty');
            if ( regExp.test( dataBlockVal ) ) {
              dataBlock.addClass('is-symbol');
            } else {
              dataBlock.removeClass('is-symbol');
            }
          });
        },
        checkState: function(dataBlock) {
          var dataBlockInput = dataBlock.find('input[type="text"]'),
              dataBlockVal = dataBlockInput.val(),
              regExp = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i;

          if ( dataBlockVal === '' ) {
            dataBlock.addClass('is-empty');
            return false;
          } else if ( !regExp.test( dataBlockVal ) && !dataBlock.is('.is-symbol') ) {
            dataBlock.addClass('is-format');
            return false;
          } else if ( dataBlock.is('.is-format, .is-symbol') ) {
            return false;
          }
        }
      };


      // init reg form onload
      function initRegForm(thisForm) {

        // init data block validation
        thisForm.find('[data-valid]').each(function() {
          var dataBlock = $(this),
              dataBlockType = dataBlock.attr('data-valid');

          if ( dataBlockType === 'name' ) {
              nameBlock.validateBlock(dataBlock);
            } else if ( dataBlockType === 'date' ) {
              dateBlock.initBlock(dataBlock);
            } else if ( dataBlockType === 'phone' ) {
              phoneBlock.initBlock(dataBlock);
              phoneBlock.validateBlock(dataBlock);
            } else if ( dataBlockType === 'email' ) {
              emailBlock.validateBlock(dataBlock);
            }

        });


        // init submit
        $('.js-reg-form-btn').on('click', function() {
          var isFormValid = true;

          // check data block state
          thisForm.find('[data-valid]').each(function() {
            var dataBlock = $(this),
                dataBlockType = dataBlock.attr('data-valid');

            if ( dataBlockType === 'name' ) {
              if ( nameBlock.checkState(dataBlock) === false ) {
                isFormValid = false;
              }
            } else if ( dataBlockType === 'date' ) {
              if ( dateBlock.checkState(dataBlock) === false ) {
                isFormValid = false;
              }
            } else if ( dataBlockType === 'phone' ) {
              if ( phoneBlock.checkState(dataBlock) === false ) {
                isFormValid = false;
              }
            } else if ( dataBlockType === 'email' ) {
              if ( emailBlock.checkState(dataBlock) === false ) {
                isFormValid = false;
              }
            }

          });

          console.log( isFormValid );


          // submit reg form
          if ( isFormValid ) {

            window.a7PreparedData = [];
            phoneField = '';

            if ( $('.js-number').val().indexOf('(') > -1 ) {
              phoneField = $('.js-number').val().split('(')[1].replace(')', '').replace(' ', '').replace(/\-/g, '');
            } else {
              phoneField = $('.js-number').val().split(' ')[1];
            }

            window.A7.registration.requestParams.dataRegCountry = regionSelectVal;
            window.A7.registration.requestParams.dataRegPhonenumber = phoneField;
            window.A7.registration.send();
          }

          return false;
        });

      }

      initRegForm( regForm );


      // horoscope switcher
      $('.js-hor-sign').on('click', function() {
        var thisSign = $(this),
          parentBlock = thisSign.closest('.js-hor'),
          horBlockResult = parentBlock.find('.js-hor-result li'),
          thisSignIndex;

        thisSignIndex = thisSign.index();
        parentBlock.find('.js-hor-sign').removeClass('is-active');
        thisSign.addClass('is-active');
        horBlockResult.removeClass('is-visible');
        horBlockResult.eq( thisSignIndex ).addClass('is-visible');
      });


      // scroll to reg form
      $('.js-roll-btn').on('click', function() {
        $('html, body').animate({
          scrollTop: $('.js-reg-form').offset().top - 10
        }, 800);
        return false;
      });


      // show reg form js onload
      regForm.removeClass('is-invisible');

    } // init

  };

  window.A7.landRegistration.init();





})(window);



