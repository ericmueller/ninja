/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

////////////////////////////////////////////////////////////////////////
//
var Montage =               require("montage/core/core").Montage,
    Component =             require("montage/ui/component").Component,
    HtmlDocumentModel =     require("js/document/models/html").HtmlDocumentModel,
    DesignDocumentView =    require("js/document/views/design").DesignDocumentView,
    CodeDocumentView =		require("js/document/views/design-code").DesignCodeView;
////////////////////////////////////////////////////////////////////////
//
exports.HtmlDocument = Montage.create(Component, {
    ////////////////////////////////////////////////////////////////////
    //
    hasTemplate: {
        value: false
    },
    ////////////////////////////////////////////////////////////////////
    //
    model: {
        value: null
    },
    ////////////////////////////////////////////////////////////////////
    //
    loaded: {
        value: {callback: null, context: null}
    },
    ////////////////////////////////////////////////////////////////////
    //
    _observer: {
        value: null
    },
    ////////////////////////////////////////////////////////////////////
    //
    exclusionList: {
        value: ["HTML", "BODY", "NINJA-CONTENT", "NINJA-VIEWPORT"]
    },
    ////////////////////////////////////////////////////////////////////
    //
    inExclusion: {
        value: function(element) {
            if(this.exclusionList.indexOf(element.nodeName) === -1) {
                return -1;
            }
            return 1;
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    init: {
        value: function(file, context, callback, view, template) {
            //Storing callback data for loaded dispatch
            this.loaded.callback = callback;
            this.loaded.context = context;
            //Creating instance of HTML Document Model
            this.model = Montage.create(HtmlDocumentModel,{
                file: {value: file},
                fileTemplate: {value: template},
                parentContainer: {value: document.getElementById("iframeContainer")}, //Saving reference to parent container of all views (should be changed to buckets approach
                views: {value: {'design': DesignDocumentView.create(), 'code': CodeDocumentView.create()}} //TODO: Add code view logic
            });
            //Calling the any init routines in the model
            this.model.init();
            //Initiliazing views and hiding
            if (this.model.views.design.initialize(this.model.parentContainer)) {
                //Hiding iFrame, just initiliazing
                this.model.views.design.hide();
                //Setting the iFrame property for reference in helper class
                this.model.webGlHelper.iframe = this.model.views.design.iframe;
            } else {
                //ERROR: Design View not initialized
            }

            
            //TODO: Make sure you have a boolean to indicate if view was initilize and handle errors (just like design view above)
            //initialize the code view for the html document and hide it since design is the default view
            this.model.views.code.initialize(this.model.parentContainer);
            this.model.views.code.hide();


            //
            if (view === 'design') {
                //TODO: Remove reference and use as part of model
                this.currentView = 'design';
                //Setting current view object to design
                this.model.currentView = this.model.views.design;
                //Showing design iFrame
                this.model.views.design.show();
                this.model.views.design.iframe.style.opacity = 0;
                this.model.views.design.content = this.model.file.content;
                //TODO: Improve reference (probably through binding values)
                this.model.views.design._webGlHelper = this.model.webGlHelper;
                //Rendering design view, using observers to know when template is ready
                this.model.views.design.render(function () {
                    //Adding observer to know when template is ready
                    this._observer = new WebKitMutationObserver(this.handleTemplateReady.bind(this));
                    this._observer.observe(this.model.views.design.document.head, {childList: true});
                }.bind(this), template, {viewCallback: this.handleViewReady, context: this});
            } else  if (view === 'code'){
                //TODO: Add logic to open document in code view since it's now available
            } else {
	            //TODO: Add error handling
            }
        }
    },
    ////////////////////////////////////////////////////////////////////
    //TODO: Make into one method to use here and one init
    reloadView: {
        value: function (view, template, doc) {
            //
            this.model.parentContainer.removeChild(this.model.views.design.iframe);
            //Initiliazing views and hiding
            if (this.model.views.design.initialize(this.model.parentContainer)) {
                //Hiding iFrame, just initiliazing
                this.model.views.design.hide();
                //Setting the iFrame property for reference in helper class
                this.model.webGlHelper.iframe = this.model.views.design.iframe;
            } else {
                //ERROR: Design View not initialized
            }
            //
            if (view === 'design') {
                //TODO: Remove reference and use as part of model
                this.currentView = 'design';
                //Setting current view object to design
                this.model.currentView = this.model.views.design;
                //Showing design iFrame
                this.model.views.design.show();
                this.model.views.design.iframe.style.opacity = 0;
                this.model.views.design.content = this.application.ninja.ioMediator.tmplt.parseHtmlToNinjaTemplate(doc);
                //
                if (!template) {
                    if (this.model.views.design.content.body.indexOf('Ninja-Banner Dimensions@@@') !== -1) {
                        dimensions = (this.model.views.design.content.body.split('Ninja-Banner Dimensions@@@'))[1].split('-->')[0].split('x');
                        dimensions = {width: parseInt(dimensions[0]), height: parseInt(dimensions[1])};
                        template = {type: 'banner', size: dimensions};
                    }
                }
                //TODO: Improve reference (probably through binding values)
                this.model.views.design._webGlHelper = this.model.webGlHelper;
                //Rendering design view, using observers to know when template is ready
                this.model.views.design.render(function () {
                    //Adding observer to know when template is ready
                    this._observer = new WebKitMutationObserver(this.handleTemplateReady.bind(this));
                    this._observer.observe(this.model.views.design.document.head, {childList: true});
                }.bind(this), template, {viewCallback: this.handleReloadViewReady, context: this});
            } else if(view === 'code'){
            	//TODO: Add logic to handle external changed files
            	//Checking for template type and not saving external data
            	if (doc.template && (doc.template.type === 'banner' || doc.template.type === 'animation')) {
                	this.model.views.code.load(this.application.ninja.ioMediator.tmplt.parseNinjaTemplateToHtml(false, doc, true, null).content);
                } else {
                 	this.model.views.code.load(this.application.ninja.ioMediator.tmplt.parseNinjaTemplateToHtml(false, doc, false, null).content);
                }
                //Setting current view object to code
                this.currentView = 'code';
                this.model.currentView = this.model.views.code;
                this.model.currentViewIdentifier = this.model.currentView.identifier;
            } else {
	            //TODO: Identify default view (probably code) - Error handling
            }
        }  
    },
    ////////////////////////////////////////////////////////////////////
    //
    handleTemplateReady: {
        value: function (e) {
            //Removing observer, only needed on initial load
            this._observer.disconnect();
            this._observer = null;
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    handleViewReady: {
        value: function(mObjects) {
            this.model.mObjects = mObjects;
            // TODO: Find a better way to initialize this property
            // Assign the domContainer to be the document root on open
            if(typeof this.model.domContainer !== "undefined") {
                this.model.domContainer = this.model.documentRoot;
            }
            this.model.currentViewIdentifier = this.model.currentView.identifier;
            //Making callback after view is loaded
            this.loaded.callback.call(this.loaded.context, this);
        }
    },
    handleReloadViewReady: {
        value: function(mObjects) {
            this.model.mObjects = mObjects;
            // TODO: Find a better way to initialize this property
            // Assign the domContainer to be the document root on open
            if(typeof this.model.domContainer !== "undefined") {
                this.model.domContainer = this.model.documentRoot;
            }
            this.model.currentViewIdentifier = this.model.currentView.identifier;
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    closeDocument: {
        value: function (context, callback) {
            //Closing document (sending null to close all views)
            this.model.close(null, function () {if (callback) callback.call(context, this);}.bind(this));
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    serializeDocument: {
        value: function () {
            // Serialize the current scroll position
            //TODO: Move these properties to the design view class
            this.model.scrollLeft = this.application.ninja.stage._scrollLeft;
            this.model.scrollTop = this.application.ninja.stage._scrollTop;
            this.model.userContentLeft = this.application.ninja.stage._userContentLeft;
            this.model.userContentTop = this.application.ninja.stage._userContentTop;


            // Serialize the selection, the container and grid
            //TODO: Move this property to the design view class
            this.model.selection = this.application.ninja.selectedElements.slice(0);

            // Pause the videos
            //TODO: Move these to be handled on the show/hide methods in the view
            this.model.views.design.pauseVideos();
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    deserializeDocument: {
        value: function () {
            // Deserialize the current scroll position
             //TODO: Move these properties to the design view class
            this.application.ninja.stage._scrollLeft = this.model.scrollLeft;
            this.application.ninja.stage._scrollTop = this.model.scrollTop;
            this.application.ninja.stage._userContentLeft = this.model.userContentLeft;
            this.application.ninja.stage._userContentTop = this.model.userContentTop;

            // Serialize the undo
            // TODO: Save the montage undo queue
        }
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
