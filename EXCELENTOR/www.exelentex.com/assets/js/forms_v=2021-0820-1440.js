jQuery(function ($) {
    'use strict';

    // require https://github.com/jquery-form/form

    // find block in form where messages will appear
    var msg_container = '.result-message';
    var msg_container_success = '.ajax-form-succes-message';
    var msg_container_outside = '#form-message-popup'; // if exists on page will used instead msg_container
    // message template in container
    var msg_template_success = '<div class="form-message {key}">{message}</div>';
    var msg_template_error = '<div class="form-message error {key}">{message}</div>';

    var field_group_class = 'field';
    var error_css_class = 'error-field';
    var error_field_css_class = 'field-error';

    // end config

    var $html = $('html');
    var $body = $('body');

    $body.on('submit', 'form.ajax-form', beforeSubmit);

    $body.on('input', 'form.ajax-form input', inputChange);
    $body.on('input', 'form.ajax-form textarea', inputChange);
    $body.on('change', 'form.ajax-form select', inputChange);

    function inputChange() {
        $(this).closest('.' + field_group_class).removeClass(error_css_class).find('.' + error_field_css_class).html('');
    }

    function beforeSubmit() {
        var $form = $(this),
            $form_msg = $form.find(msg_container),
            $form_btn = $form.find('button[type="submit"], input[type="submit"]');

        $form.ajaxSubmit({
            dataType: 'json',
            beforeSubmit: function () {
                var rcres = grecaptcha.getResponse(); 
                if(rcres.length){
                    var $captcha_field = $form.find('_captcha');
                    $captcha_field.value = rcres;
                  }else{
                    showMessage($form_msg, false, 'Please verify reCAPTCHA');
                    return false;
                  }

                $form_msg.html('');
                $form_btn.prop('disabled', true).addClass('disabled btn-waiting');
            },
            error: function (data) {
                if(data.status==200)
                {
                    restore(data, $form, $form_btn, $form_msg);
                }
                else
                {
                    $form_btn.prop('disabled', false).removeClass('disabled btn-waiting');
                    resetFileInput($form); // always reset file-input
                    showMessage($form_msg, false, '<p>Server error.</p>');
                    $(document).trigger('iqforms:formServerError');
                }
            },
            success: function (data) {
                restore(data, $form, $form_btn, $form_msg);
            }
        });

        return false;
    }

    function restore(data, form, form_btn, form_msg)
    {
        form_btn.prop('disabled', false).removeClass('disabled btn-waiting');
        //alert(JSON.stringify(data));
        if (!data.errors) {
            resetFileInput(form);
        }
        form.find('.' + error_css_class).removeClass(error_css_class).find('.' + error_field_css_class).html('');
        if (data.errors) {
            // show yii errors
            $.each(data.errors, function (field, errors) {
                form.find('[name="' + field + '"]').closest('.' + field_group_class).addClass(error_css_class).find('.' + error_field_css_class).html(errors[0]);
            });
            $(document).trigger({
                type: 'iqforms:formHasErrors',
                formErrors: data.errors
            });
        } else if (data.responseText=="MF000") {
            if ('grecaptcha' in window) {
                grecaptcha.reset();
            }
            // reset form
            if (typeof form.attr('data-update-reset') !== 'undefined') {
                // http://stackoverflow.com/questions/13754071/modify-underlying-form-reset-values
                form.find('input').attr('value', function () { return this.value });
                form.find(':selected').prop('selected', true);
                form.find(':not(:selected)').removeAttr('selected');
            } else {
                form[0].reset();
                // reset select2
                if (form.find('.select2').length) {
                    form.find('select').val('').trigger('change');
                }
            }
            if ($(msg_container_outside).length) {
                $html.addClass('opened-popup').removeClass('opened-nav');
                $(msg_container_outside).addClass('visible');
            } else if (data.message) {
                showMessage(form_msg, true, '<p>' + data.message + '</p>');
            } else if (data.response) {
                showMessage(form_msg, true, '<p>' + data.response + '</p>');
            } else if (form.find(msg_container_success).length) {
                var msg = form.find(msg_container_success).html();
                showMessage(form_msg, true, msg);
            }
            /*if (data.next) {
                window.location.href = data.next;
            } else if (data.reload) {
                window.location.reload();
            } else {
                $html.addClass('opened-popup').removeClass('opened-nav');
                $(msg_container_outside).addClass('visible');
            }*/
            $(document).trigger({
                type: 'iqforms:formSentSuccess',
                formId: form.attr('id')
            });
        } else {
            var error_msg = data.responseText=="MF253" ? "CAPTCHA error" : 'Unknown error';
            showMessage(form_msg, false, '<p>' + error_msg + '</p>');
            $(document).trigger({
                type: 'iqforms:formSentError',
                formMessage: error_msg
            });

            if ('grecaptcha' in window) {
                grecaptcha.reset();
            }
        }
    }

    function resetFileInput(form) {
        // deal with fileinput.js
        if (form.find('.fileinput-clear').length) {
            form.find('.fileinput-clear').trigger('click');
        } else {
            form.find('input[type="file"]').each(function () {
                $(this).replaceWith($(this).val('').clone(true));
            });
        }
    }

    function showMessage($container, success, message) {
        if (!$container.length) {
            alert(message);
            return;
        }
        var msg_key = 'msg-' + (new Date().getTime());
        var msg_template = success ? msg_template_success : msg_template_error;
        msg_template = msg_template.replace('{key}', msg_key).replace('{message}', message);
        $container.append(msg_template);
        //$container.find('.' + msg_key).fadeIn(200);
        setTimeout(function () {
            $container.find('.' + msg_key).fadeOut(200);
        }, 5000);
    }

});
