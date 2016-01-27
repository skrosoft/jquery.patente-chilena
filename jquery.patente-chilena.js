/* Copyright (c) 2015 Vincent Guyard (vguyard@onaxis.cl) http://www.onaxis.cl
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-2.0.php)
 * Use only for non-commercial usage.
 *
 * Version : 0.1
 *
 */

(function($)
{
    jQuery.fn.PatenteChilena = function(options)
    {
        var defaults = {
            digito_verificador: null,
            on_error: function(){},
            on_success: function(){},
            validation: true,
            format: true,
            format_on: 'change'
        };

        var opts = $.extend(defaults, options);

        return this.each(function(){

            if(defaults.format)
            {
                jQuery(this).bind(defaults.format_on, function(){
                    jQuery(this).val(jQuery.PatenteChilena.formatear(jQuery(this).val(),defaults.digito_verificador==null));
                });
            }
            if(defaults.validation)
            {
                if(defaults.digito_verificador == null)
                {
                    jQuery(this).bind('blur', function(){
                        var patente = jQuery(this).val();
                        if(jQuery(this).val() != "" && !jQuery.PatenteChilena.validar(patente))
                        {
                            defaults.on_error();
                        }
                        else if(jQuery(this).val() != "")
                        {
                            defaults.on_success();
                        }
                    });
                }
                else
                {
                    var id = jQuery(this).attr("id");
                    jQuery(defaults.digito_verificador).bind('blur', function(){
                        var patente = jQuery("#"+id).val()+"-"+jQuery(this).val();
                        if(jQuery(this).val() != "" && !jQuery.PatenteChilena.validar(patente))
                        {
                            defaults.on_error();
                        }
                        else if(jQuery(this).val() != "")
                        {
                            defaults.on_success();
                        }
                    });
                }
            }
        });
    }
})(jQuery);

/**
 Funciones
 */


jQuery.PatenteChilena = {

    formatear:  function(patente, digitoVerificador)
    {
        var sPatente = new String(patente);
        var sPatenteFormateado = '';
        sPatente = jQuery.PatenteChilena.quitarFormato(sPatente);

        var verificador = sPatente.length > 6 ? sPatente.substring(6) : false;
        sPatente = sPatente.substring(0, 6);

        if (sPatente.length == 6){
            if (jQuery.PatenteChilena.esAntigua(sPatente)){
                sPatente = [sPatente.slice(0, 2), '-', sPatente.slice(2)].join('');
            }else{
                sPatente = [sPatente.slice(0, 4), '-', sPatente.slice(4)].join('');
            }
        }

        if (verificador){
            sPatente += '-' + verificador;
        }

        return sPatente;
    },

    quitarFormato: function(patente)
    {
        return patente.replace(/\W+/g, "").toUpperCase();
    },

    esAntigua: function(texto){
        return texto.match(/^[a-z]{2}[\.\- ]?[0-9]{2}[\.\- ]?[0-9]{2}$/i)
    },

    esNueva: function(texto){
        return texto.match(/^[b-d,f-h,j-l,p,r-t,v-z]{2}[\-\. ]?[b-d,f-h,j-l,p,r-t,v-z]{2}[\.\- ]?[0-9]{2}$/i)
    },

    validar:   function(texto)
    {
        texto = jQuery.PatenteChilena.quitarFormato(texto);

        if (texto.length != 7)   return false;

        var verificador = texto.substring(6);
        texto = texto.substring(0, 6);

        if (!this.esAntigua(texto) && !this.esNueva(texto))   return false;

        var valor=0;
        var s=2;
        var res=0;
        var DV = 0;

        for (i=texto.length-1 ; i>=0; i--) {

            var letra = texto.charAt(i);

            if (letra=='P' || letra=='0' ){valor=0;}
            if (letra=='B' || letra=='Q' ||  letra=='1'){var valor=1;}
            if (letra=='C' || letra=='R' ||  letra=='2' ){var valor=2;}
            if (letra=='D' || letra=='S' ||  letra=='3'){var valor=3;}
            if (letra=='F' || letra=='T' ||  letra=='4'){var valor=4;}
            if (letra=='G' || letra=='V' ||  letra=='5'){var valor=5;}
            if (letra=='H' || letra=='W' ||  letra=='6'){var valor=6;}
            if (letra=='J' || letra=='X' ||  letra=='7'){var valor=7;}
            if (letra=='K' || letra=='Y' ||  letra=='8'){var valor=8;}
            if (letra=='L' || letra=='Z' ||  letra=='9'){var valor=9;}

            var res=res+(valor*s);
            var s=s+1;
        }

        var DVResto=res%11;
        var DV = 11-DVResto;
        if (DV==10){var DV='K';}
        if (DV==11){var DV='0';}

        return DV == verificador;
    },
};