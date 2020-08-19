# jQuery.madTopParticipants

This plugin for Blackbaud Luminate provides a Top Participants widget across multiple Teamraisers.

### Configuration Examples
```html
<div class="section">                                                                                                          
  <div class="container">                                                                                                      
    <h2>Top Participants</h2>                                                                                                  
    <div id="top_participant_results" class="row list-results">                                                                           
    </div>                                                                                                                     
  </div>                                                                                                                       
</div>                                                                                                                         
                                                                                                                               
<!--// Results Template //-->                                                                                                  
<script id="participant_results_template" type="text/template">                                                                          
  <div class="col-12">                                                                                                         
    <div class="row shaded">                                                                                                   
      <div class="col-12 col-md-8">                                                                                            
        <strong>%%name%%</strong>
      </div>                                                                                                                   
      <div class="col-12 col-md-4 d-flex align-items-right">                                                                   
        %%total%%                                                                                                              
      </div>                                                                                                                   
    </div>                                                                                                                     
  </div>                                                                                                                       
</script>                                                                                                                      
```
```javascript
<script>                                                                                                                       
 jQuery(document).ready(function ($) {                                                                                         
   var options =                                                                                                               
   {                                                                                                                           
     "proxyURL":"AjaxProxy?auth=[[S86:true]]&cnv_url=",                                                                        
     "nonsecureConvioPath":"http://[[S29:DOMAIN]][[S29:PATH]]",                                                                
     "secureConvioPath":"https://[[S29:SECURE_DOMAIN]][[S29:SECURE_PATH]]",                                                    
     "apiKey":"[[S0:CONVIO_API_KEY]]",                                                                                         
     "fr_ids":["1234", "5678"],
     "maxCount": 10,                                                                                                
     "loadingImage": "../images/loader.gif",                                                                                   
     "loadingImageAlt": "&#x1F551",                                                                                            
     "results_template_id": "participant_results_template"                                                                               
   }                                                                                                                           
  $("#top_participant_results").madTopParticipants( options );                                                                            
 });                                                                                                                           
</script>                                                                                                                      
```
### Options

Option | Description
------ | -------------
**proxyURL**: null | Settings to provide connectivity to your Teamraiser instance.
**nonsecureConvioPath**: null | Settings to provide connectivity to your Teamraiser instance.
**secureConvioPath**: null | Settings to provide connectivity to your Teamraiser instance.
**apiKey**: null | Settings to provide connectivity to your Teamraiser instance.
**fr_ids**: [] | An array of Teamraiser Ids.
**maxCount**: 10 | The number of top participants to display.
**loadingImage**: null | The optional path to an image to display while the results are being compiled.
**loadingImageAlt**: null | The optional alt text for the image to display while the results are being compiled.
**loadingText**: null | The optional text to display while the results are being compiled.
**callback**: function() {} | An optional function to execute upon completion.
