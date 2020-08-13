/**********************************************************************\
*
*	jQuery.madTopParticipants
*	----------------------
*	version: 2.0.1
*	date: 2020/08/04
*	license: GPL-3.0-or-later
*	copyright (C) 2020 Brian Patrick Mucha
*
\**********************************************************************/

/**********************************************************************\
*
* <div class="section">
*   <div class="container">
*     <h2>Top Participants</h2>
*     <div id="list_results" class="row list-results">
*     </div>
*   </div>
* </div>
*
* <!--// Results Template //-->
* <script id="list_item_template" type="text/template">
*   <div class="col-12">
*     <div class="row shaded">
*       <div class="col-12 col-md-8">
*         <strong><a href="http://[[S29:DOMAIN]][[S29:PATH]]TR?px=%%id%%&pg=personal&fr_id=%%fr_id%%">%%name%%</a></strong><br />
*       </div>
*       <div class="col-12 col-md-4 d-flex align-items-right">
*         %%total%%
*       </div>
*     </div>
*   </div>
* </script>
*
* <script>
*  jQuery(document).ready(function ($) {
*    var options =
*    {
*      "proxyURL":"AjaxProxy?auth=[[S86:true]]&cnv_url=",
*      "nonsecureConvioPath":"http://[[S29:DOMAIN]][[S29:PATH]]",
*      "secureConvioPath":"https://[[S29:SECURE_DOMAIN]][[S29:SECURE_PATH]]",
*      "apiKey":"[[S0:CONVIO_API_KEY]]",
*      "fr_ids":["1234", "5678"],
*      "loadingImage": "../images/loader.gif",
*      "loadingImageAlt": "&#x1F551",
*      "results_template_id": "list_item_template"
*    }
*   $("#list_results").madTopParticipants( options );
*  });
* </script>
*
\**********************************************************************/

(function ($) {

	"use strict";

	/* ********** Private Functions ********** */

	function markLoading(element, settings) {
		$(".search_item").remove();
		if (settings.loadingImage && settings.loadingText) {
			element.append("<div class=\"list_loading\"><img alt=\"" + settings.loadingImageAlt + "\" src=\"" + settings.loadingImage + "\" />" + settings.loadingText + "</div>");
		} else if (settings.loadingImage) {
			element.append("<div class=\"list_loading\"><img alt=\"" + settings.loadingImageAlt + "\" src=\"" + settings.loadingImage + "\" /></div>");
		} else if (settings.loadingText) {
			element.append("<div class=\"list_loading\">" + settings.loadingText + "</div>");
		}
	}

	function getAllTopParticipants(element, settings) {

		var deferreds = [];
		var results = [];

		$.each(settings.fr_ids, function( index, value ) {

			var paramString =
				"method=getTopParticipantsData" +
				"&v=1.0" +
				"&api_key=" + settings.apiKey +
				"&response_format=json" +
				"&suppress_response_codes=true" +
				"&fr_id=" + value;

			var requestURL = settings.proxyURL + escape(settings.secureConvioPath + "CRTeamraiserAPI?" + paramString);
			var deferred = $.getJSON(requestURL, function (result) { results.push(result); });

			deferreds.push(deferred);

		});

		$.when.apply($, deferreds)
			.then(function()
			{
				var compiledResults = [];
				$.each(results, function( index, value ) {
					if(value.getTopParticipantsDataResponse) {
						var counter;
						for (counter = 0; counter < value.getTopParticipantsDataResponse.teamraiserData.length; counter++) {
							value.getTopParticipantsDataResponse.teamraiserData[counter].fr_id = settings.fr_ids[index];
							value.getTopParticipantsDataResponse.teamraiserData[counter].total_num = Number(value.getTopParticipantsDataResponse.teamraiserData[counter].total.replace(/[^0-9.-]+/g,""));
						}
						compiledResults = [].concat(compiledResults, value.getTopParticipantsDataResponse.teamraiserData);
					}
				});
				updateDomElement(compiledResults, element, settings);
			})
			.fail(function()
			{
				window.console && console.error("Top Participants: unsuccessful");
			});

	}

	function updateDomElement(data, element, settings) {
		if( data.errorResponse )
		{
			element.html("<div class=\"search_loading\">(" + data.errorResponse.message + ")</div>");
		} else {
			$(element).empty();
			var trObject = ensureArray(data);
			if ($(trObject).length > 0) {
				trObject.sort((a,b)=>b.total_num-a.total_num);
				$.each(trObject, function (idx, val) {

					var template = document.getElementById(settings.results_template_id);
					var templateHtml = template.innerHTML;

					var newEntry;

					var fr_id;
					var id;
					var name;
					var total;

					fr_id = this.fr_id;
					id = this.id;
					name = this.name;
					total = this.total;

					newEntry = templateHtml
						.replace(/%%fr_id%%/g, fr_id)
						.replace(/%%id%%/g, id)
						.replace(/%%name%%/g, name)
						.replace(/%%total%%/g, total);

					element.append(newEntry);

					if(idx == settings.maxCount) { return false; }

				});
			} else {
				element.html("<div class=\"search_loading\">(end of list)</div>");
			}
			if (settings.callBack) { settings.callBack(); }
		}
	}

	function ensureArray(a, b, n) {
		if (arguments.length === 0) return [];
		if (arguments.length === 1) {
			if (a === undefined || a === null) return [];
			if (Array.isArray(a)) return a;
		}
		return Array.prototype.slice.call(arguments);
	}

	/* ********** Plugin Functions ********** */

	var settings = {};

	var defaults =
	{
		"fr_ids": [],
		"maxCount": 10,
		"loadingImage": null,
		"loadingImageAlt": null,
		"loadingText": null,
		"callback": function() {}
	};

	var methods =
	{
		init: function (options) {
			settings = $.extend({}, defaults, options);
			markLoading(this, settings);
			this.data("settings", settings);	// Store the state for pagination.
			getAllTopParticipants(this, settings);
		}
	};

	$.fn.madTopParticipants = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist on jQuery.madTopParticipants");
		}
	};

})(jQuery);
