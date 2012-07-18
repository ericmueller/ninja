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

var Montage = require("montage/core/core").Montage,
	Component = require("montage/ui/component").Component,
	nj = require("js/lib/NJUtils").NJUtils,
	EasingMenuPopup = require("js/panels/Timeline/EasingMenu.reel").EasingMenu;

var TimelinePanel = exports.TimelinePanel = Montage.create(Component, {

    /* === BEGIN: Models === */
	_user_layers: {
		value: null
	},
    user_layers: {
        serializable: true,
        get: function() {
        	return this._user_layers;
        },
        set: function(newVal) {
        	this._user_layers = newVal;
        }
    },

	_track_container: {
		value: null
	},
    track_container: {
        serializable: true,
        get: function() {
        	return this._track_container;
        },
        set: function(newVal) {
        	this._track_container = newVal;
        }
    },

	_timeline_leftpane: {
		value: null
	},
    timeline_leftpane: {
        serializable: true,
        get: function() {
        	return this._timeline_leftpane;
        },
        set: function(newVal) {
        	this._timeline_leftpane = newVal;
        }
    },

	_layer_tracks: {
		value: null
	},
    layer_tracks: {
        serializable: true,
        get: function() {
        	return this._layer_tracks;
        },
        set: function(newVal) {
        	this._layer_tracks = newVal;
        }
    },

	_master_track: {
		value: null
	},
    master_track: {
        serializable: true,
        get: function() {
        	return this._master_track;
        },
        set: function(newVal) {
        	this._master_track = newVal;
        }
    },

	_time_markers: {
		value: null
	},
    time_markers: {
        serializable: true,
        get: function() {
        	return this._time_markers;
        },
        set: function(newVal) {
        	this._time_markers = newVal;
        }
    },

	_playhead: {
		value: null
	},
    playhead: {
        serializable: true,
        get: function() {
        	return this._playhead;
        },
        set: function(newVal) {
        	this._playhead = newVal;
        }
    },

	_playheadmarker: {
		value: null
	},
    playheadmarker: {
        serializable: true,
        get: function() {
        	return this._playheadmarker;
        },
        set: function(newVal) {
        	this._playheadmarker = newVal;
        }
    },

	_timetext: {
		value: null
	},
    timetext: {
        serializable: true,
        get: function() {
        	return this._timetext;
        },
        set: function(newVal) {
        	this._timetext = newVal;
        }
    },

	_timebar: {
		value: null
	},
    timebar: {
        serializable: true,
        get: function() {
        	return this._timebar;
        },
        set: function(newVal) {
        	this._timebar = newVal;
        }
    },

	_container_tracks: {
		value: null
	},
    container_tracks: {
        serializable: true,
        get: function() {
        	return this._container_tracks;
        },
        set: function(newVal) {
        	this._container_tracks = newVal;
        }
    },

	_end_hottext: {
		value: null
	},
    end_hottext: {
        serializable: true,
        get: function() {
        	return this._end_hottext;
        },
        set: function(newVal) {
        	this._end_hottext = newVal;
        }
    },

	_container_layers: {
		value: null
	},
    container_layers: {
        serializable: true,
        get: function() {
        	return this._container_layers;
        },
        set: function(newVal) {
        	this._container_layers = newVal;
        }
    },

	_timeline_disabler: {
		value: null
	},
    timeline_disabler: {
        serializable: true,
        get: function() {
        	return this._timeline_disabler;
        },
        set: function(newVal) {
        	this._timeline_disabler = newVal;
        }
    },

	_checkable_relative: {
		value: null
	},
    checkable_relative: {
        serializable: true,
        get: function() {
        	return this._checkable_relative;
        },
        set: function(newVal) {
        	this._checkable_relative = newVal;
        }
    },

	_checkable_absolute: {
		value: null
	},
    checkable_absolute: {
        serializable: true,
        get: function() {
        	return this._checkable_absolute;
        },
        set: function(newVal) {
        	this._checkable_absolute = newVal;
        }
    },

	_checkable_animated: {
		value: null
	},
    checkable_animated: {
        serializable: true,
        get: function() {
        	return this._checkable_animated;
        },
        set: function(newVal) {
        	this._checkable_animated = newVal;
        }
    },

	_tl_configbutton: {
		value: null
	},
    tl_configbutton: {
        serializable: true,
        get: function() {
        	return this._tl_configbutton;
        },
        set: function(newVal) {
        	this._tl_configbutton = newVal;
        }
    },

    _currentDocument: {
        value : null
    },
    currentDocument : {
        get : function() {
            return this._currentDocument;
        },
        set : function(value) {
            // If it's the same document, do nothing.
            if (value === this._currentDocument) {
                return;
            }
            this._currentDocument = value;
            
            var boolDoc = false,
            	boolView = false;
            	
			// Should we enable the panel? 
			// Only if we have both a document and we're in design view.
			if (typeof(value) !== "undefined") {
				if (value.currentView === "design") {
					// We are in design view.
					boolView = true;
				}
			}
			if (typeof(this._currentDocument) !== "undefined") {
				// We have a document, or at least we have initialized the panel.  
				boolDoc = true;
			}

            if(boolDoc === false) {
                this._boolCacheArrays = false;
                this.clearTimelinePanel();
                this._boolCacheArrays = true;
                this.enablePanel(false);
            } else {
            	if(boolView === true) {
	                this._boolCacheArrays = false;
	                this.clearTimelinePanel();
	                this._boolCacheArrays = true;
	
	                // Rebind the document events for the new document context
	                this._bindDocumentEvents();
	                
	                // Initialize the timeline for the document.
	                this.initTimelineForDocument();
            		this.enablePanel(true);
				}
            }
        }
    },

    _currentSelectedContainer: {
        value: null
    },
    currentSelectedContainer: {
        get: function() {
            return this._currentSelectedContainer;
        },
        set: function(newVal) {
            if(this._currentSelectedContainer !== newVal) {
                this._currentSelectedContainer = newVal;
                if (this._ignoreNextContainerChange === true) {
                    this._ignoreNextContainerChange = false;
                    return;
                }
                this.application.ninja.currentDocument.setLevel = true;
                
                if(this._currentDocument.currentView === "design") {
                    this._boolCacheArrays = false;
                    this.clearTimelinePanel();
                    this._boolCacheArrays = true;
    
                    // Rebind the document events for the new document context
                    this._bindDocumentEvents();
                    
                    // Initialize the timeline for the document.
                    this.initTimelineForDocument();
                }
            }
        }
    },

    _arrLayers:{
        value:[]
    },
    arrLayers:{
        serializable:true,
        get:function () {
            return this._arrLayers;
        },
        set:function (newVal) {
            this._arrLayers = newVal;
            this.needsDraw = true;
            this.cacheTimeline();
        }
    },

    _temparrLayers:{
        value:[]
    },
    temparrLayers:{
        get:function () {
            return this._temparrLayers;
        },
        set:function (newVal) {
            this._temparrLayers = newVal;
        }
    },


    _layerRepetition:{
        value:null
    },
    layerRepetition:{
        get:function () {
            return this._layerRepetition;
        },
        set:function (newVal) {
            this._layerRepetition = newVal;
        }
    },
    
    _lastInsertionIndex: {
    	value: false
    },
    lastInsertionIndex: {
    	get: function() {
    		return this._lastInsertionIndex;
    	},
    	set: function(newVal) {
    		this._lastInsertionIndex = newVal;
    	}
    },
    
    _areTracksScrolling: {
    	value: false
    },
    
    _areTracksCollapsing: {
    	value: false
    },
    
    _currentOpenSpanMenu: {
    	value: false
    },
    currentOpenSpanMenu: {
    	get: function() {
    		return this._currentOpenSpanMenu;
    	},
    	set: function(newVal) {
    		this._currentOpenSpanMenu = newVal;
    	}
    },

    // Set to false to skip array caching array sets in currentDocument
    _boolCacheArrays:{
        value:true
    },

	// Current layer number: iterated and used to assign layer IDs.
    _currentLayerNumber:{
        value:0
    },
    currentLayerNumber:{
        get:function () {
            return this._currentLayerNumber;
        },
        set:function (newVal) {
            if (newVal !== this._currentLayerNumber) {
                this._currentLayerNumber = newVal;
                this.cacheTimeline();
            }
        }
    },

    _currentElementsSelected: {
    	value: []
    },
    currentElementsSelected: {
    	get: function() {
    		return this._currentElementsSelected;
    	},
    	set: function(newVal) {
    		this._currentElementsSelected = newVal;
    		this.cacheTimeline();
    	}
    },

    _currentLayersSelected:{
        value:[]
    },
    currentLayersSelected:{
        get:function () {
            return this._currentLayersSelected;
        },
        set:function (newVal) {
            this._currentLayersSelected = newVal;
            this.cacheTimeline();
        }
    },
    
    _easingMenu: {
    	value: null
    },
    easingMenu: {
    	serializable: true,
    	get: function() {
    		return this._easingMenu;
    	},
    	set: function(newVal) {
    		this._easingMenu = newVal;
    	}
    },
    
    // The index of the last layer that was clicked on
    // (used for shift-click multiselect)
    _lastLayerClicked : {
    	value: 0
    }, 
    lastLayerClicked: {
    	serializable: true,
    	get: function() {
    		return this._lastLayerClicked;
    	},
    	set: function(newVal) {
    		this._lastLayerClicked = newVal
    	}
    },

    _millisecondsOffset:{
        value:1000
    },
    millisecondsOffset:{
        get:function () {

            return this._millisecondsOffset;
    },
        set:function (newVal) {
            if (newVal !== this._millisecondsOffset) {

                this.tempValue  = newVal;
                var tempValue = (1/newVal) * 1000000;
                newVal = tempValue;

                this._millisecondsOffset= newVal;
                this.drawTimeMarkers();
                NJevent('tlZoomSlider',this);
            }
        }
    },

    _masterDuration:{
        value:0
    },
    masterDuration:{
        serializable:true,
        get:function () {
            return this._masterDuration;
        },
        set:function (val) {
            this._masterDuration = val;
            var intDur = Math.round(val/12),
           		strWidth = intDur + "px";
            this.timebar.style.width = strWidth;
        }
    },

    _trackRepetition:{
        value:null
    },
    trackRepetition:{
        get:function () {
            return this._trackRepetition;
        },
        set:function (newVal) {
            this._trackRepetition = newVal;
        }
    },

    _selectedKeyframes:{
        value:[]
    },
    selectedKeyframes:{
        serializable:true,
        get:function () {
            return this._selectedKeyframes;
        },
        set:function (newVal) {
            this._selectedKeyframes = newVal;
        }
    },

    _selectedTweens:{
        value:[]
    },
    selectedTweens:{
        serializable:true,
        get:function () {
            return this._selectedTweens;
        },
        set:function (newVal) {
            this._selectedTweens = newVal;
        }
    },

    _breadCrumbContainer:{
            value:null
    },
    breadCrumbContainer:{
        get:function () {
            return this._breadCrumbContainer;
        },
        set:function (value) {
            if (this._breadCrumbContainer !== value) {
                this._breadCrumbContainer = value;
            }
        }
    },

    _firstTimeLoaded:{
        value:true
    },

    _captureSelection:{
        value:false
    },

    _openDoc:{
        value:false
    },

    timeMarkerHolder:{
        value:null
    },
    
    // Drag and Drop properties
    _dragAndDropHelper : {
    	value: false
    },
    
    _dragAndDropHelperCoords: {
    	value: false
    },
    
    _dragAndDropHelperOffset : {
    	value: false
    },

    _draggingType: {
    	value: false
    },
    draggingType: {
    	get: function() {
    		return this._draggingType;
    	},
    	set: function(newVal) {
    		this._draggingType = newVal;
    	}
    },
    
    _elementsDragged: {
    	value: []
    },
    elementsDragged: {
    	get: function() {
    		return this._elementsDragged;
    	},
    	set: function(newVal) {
    		this._elementsDragged = newVal;
    	}
    },

    _dragLayerID : {
    	value: null
    },
    dragLayerID : {
    	get: function() {
    		return this._dragLayerID;
    	},
    	set: function(newVal) {
    		if (newVal !== this._dragLayerID) {
    			this._dragLayerID = newVal;
    		}
    	}
    },

    _dropLayerID : {
    	value: null
    },
    dropLayerID : {
    	get: function() {
    		return this._dropLayerID;
    	},
    	set: function(newVal) {
    		if (newVal !== this._dropLayerID) {
    			this._dropLayerID = newVal;
    			
    			var dropLayerIndex = this.getLayerIndexByID(newVal),
    				i = 0, 
    				dragLayerIndexesLength = this.currentLayersSelected.length,
    				dragAndDropDirection = 0,
    				targetIndex;
    			
    			if (dragLayerIndexesLength === 0) {
    				// Nothing was dragged, so do nothing.
    				return;
    			}
    			
    			// Is this a move up or down?
    			if (this.currentLayersSelected[0] > dropLayerIndex) {
    				dragAndDropDirection = -1;
    			} 
    			targetIndex = dropLayerIndex + dragAndDropDirection;
    			
    			// Get the target DOM element.
    			if (typeof(this.arrLayers[targetIndex]) !== "undefined") {
    				this._layerDroppedInPlace = this.arrLayers[targetIndex].layerData.stageElement;
    			} else {
    				this._layerDroppedInPlace = null;
    			}
    			
				// Splice
    			for (i = 0; i < dragLayerIndexesLength; i++) {
					var myDraggingLayer = this.arrLayers[this.currentLayersSelected[i]];
    				this.arrLayers.splice(this.currentLayersSelected[i], 1);
    				this.arrLayers.splice(dropLayerIndex, 0, myDraggingLayer);
    			}
    			this.elementsDragged = this.currentElementsSelected;
    			
    			// Cache the new info
    			this.cacheTimeline();
    			
    			// Clear drag and drop variables for future re-use
    			this._dropLayerID = null;
    			this.lastLayerClicked = 0;

    			// Sometimes, just to be fun, the drop and dragend events don't fire.
    			// So just in case, set the draw routine to delete the helper.
    			this._deleteHelper = true;
    			this._needsDOMManipulation = true;
    			this.needsDraw = true;
    		}
    	}
    },
    
    _needsDOMManipulation: {
    	value: false
    },
    
    _appendHelper: {
    	value: false
    },
    
    _deleteHelper: {
    	value: false
    },
    
    _scrollTracks: {
    	value: false
    },
    
    // Keyframe drag and drop properties
    _draggingTrackId: {
    	value: false
    },
    draggingTrackId: {
    	get: function() {
    		return this._draggingTrackId;
    	},
    	set: function(newVal) {
    		this._draggingTrackId = newVal;
    	}
    },
    
    useAbsolutePosition:{
        value:true
    },
    
    _currentDocumentUuid: {
    	value: false
    },
    
    _ignoreSelectionChanges: {
    	value: false
    },
    
	// is the control key currently being pressed (used for multiselect)
	_isControlPressed: {
		value: false
	},

	// is the shift key currently being pressed (used for multiselect) 
	_isShiftPressed: {
		value: false
	},

	// Hack to ignore extra container change event during document switching.
    _ignoreNextContainerChange: {
        value: true
    },
    /* === END: Models === */
   
    /* === BEGIN: Draw cycle === */
    prepareForDraw:{
        value:function () {
            this.initTimeline();
        }
    },
    
    draw:{
    	value: function() {
    		
    		// Drag and Drop:
    		if (this.draggingType === "layer") {
	    		
	    		// Do we have a helper to append?
	            if (this._appendHelper === true) {
	            	this.container_layers.appendChild(this._dragAndDropHelper);
	            	this._appendHelper = false;
	            }
	            // Do we need to move the helper?
	    		if (this._dragAndDropHelperCoords !== false) {
	    			if (this._dragAndDropHelper !== null) {
	    				this._dragAndDropHelper.style.top = this._dragAndDropHelperCoords;
	    			}
	    			this._dragAndDropHelperCoords = false;
	    		}
	    		// Do we need to scroll the tracks?
	    		if (this._scrollTracks !== false) {
	    			this.layout_tracks.scrollTop = this._scrollTracks;
	    			this._scrollTracks = false;
	    		}
	    		// Do we have a helper to delete?
	    		if (this._deleteHelper === true) {
	    			if (this._dragAndDropHelper === null) {
	    				// Problem....maybe a helper didn't get appended, or maybe it didn't get stored.
	    				// Try and recover the helper so we can delete it.
	    				var myHelper = this.container_layers.querySelector(".timeline-dnd-helper");
	    				if (myHelper != null) {
	    					this._dragAndDropHelper = myHelper;
	    				}
	    			}
		            if (this._dragAndDropHelper !== null) {
		            	// We need to delete the helper.  Can we delete it from container_layers?
		            	if (this._dragAndDropHelper && this._dragAndDropHelper.parentNode === this.container_layers) {
		            		this.container_layers.removeChild(this._dragAndDropHelper);
		            		this._dragAndDropHelper = null;
		            		this._deleteHelper = false;
		            	}
		            }
		            

	    		}
    		} else if (this.draggingType === "keyframe") {
	    		// Do we need to scroll the tracks?
	    		if (this._scrollTracks !== false) {
	    			this.layout_tracks.scrollLeft = this._scrollTracks;
	    			this._scrollTracks = false;
	    		}
    		}
    		
    		// Do we need to scroll the layers?
    		if (this._areTracksScrolling) {
    			this._areTracksScrolling = false;
	            this.user_layers.scrollTop = this.layout_tracks.scrollTop;
	            this.layout_markers.scrollLeft = this.layout_tracks.scrollLeft;
	         	this.playheadmarker.style.top = this.layout_tracks.scrollTop + "px";
    		}
    		
    		// Do we need to manipulate the DOM?
    		if (this._needsDOMManipulation === true) {
				this.application.ninja.elementMediator.reArrangeDOM(this.elementsDragged , this._layerDroppedInPlace);
				this.elementsDragged =[];
    		}
    	}
    },
    
    didDraw: {
    	value: function() {
    		if (this._needsDOMManipulation === true) {
    			this._needsDOMManipulation = false;
    			// We have shuffled layers, so we need to update this.selectedLayers.
    			this.selectLayers([])
    		}

    		// Do we need to scroll the layers?
    		if (this._areTracksCollapsing !== false) {
	            this.layout_tracks.scrollTop = this._areTracksCollapsing;
    			this._areTracksCollapsing = false;
    		}
    	}
    },

    /* === END: Draw cycle === */
   
    /* === BEGIN: Controllers === */
    // Create an empty layer template object with minimal defaults and return it for use
    createLayerTemplate:{
        value:function () {
            var returnObj = {};
            
            returnObj.layerData = {};
            returnObj.layerData.layerName = null;
            returnObj.layerData.layerID = null;
            returnObj.layerData.stageElement = null;
            returnObj.layerData.isMainCollapsed = true;
            returnObj.layerData.isPositionCollapsed = true;
            returnObj.layerData.isTransformCollapsed = true;
            returnObj.layerData.isStyleCollapsed = true;
            returnObj.layerData.arrLayerStyles = [];
            returnObj.layerData.elementsList = [];
            returnObj.layerData.deleted = false;
            returnObj.layerData.isSelected = false;
            returnObj.layerData.layerPosition = null;
            returnObj.layerData.created = false;
            returnObj.layerData.isTrackAnimated = false;
            returnObj.layerData.currentKeyframeRule = null;
            returnObj.layerData.trackPosition = 0;
            returnObj.layerData.arrStyleTracks = [];
            returnObj.layerData.arrPositionTracks = [];
            returnObj.layerData.tweens = [];
            returnObj.layerData.layerTag = "";
            returnObj.layerData.isVisible = true;
            returnObj.layerData.docUUID = this.application.ninja.currentDocument._uuid;
            returnObj.layerData.isTrackAnimated = false;
            returnObj.layerData.triggerBinding = false;
            returnObj.parentElementUUID = null;
            returnObj.parentElement = null;
            
            return returnObj;
        }
    },
    
    // cache Timeline data in currentDocument.
    cacheTimeline: {
    	value: function() {
    		if (typeof(this.application.ninja) === "undefined") {
    			return;
    		}
			// Store the timeline data in currentDocument...
			if (this._boolCacheArrays) {
				// ... but only if we're supposed to.
                if(this.currentDocument) {
                	var i = 0, 
                		hashLength = this.application.ninja.currentDocument.tlBreadcrumbHash.length,
                		boolHash = false;
                		
	    		    this.application.ninja.currentDocument.tlArrLayers = this.arrLayers;
	    		    this.application.ninja.currentDocument.tlCurrentSelectedContainer = this.currentDocument.model.domContainer;
	    		    this.application.ninja.currentDocument.tllayerNumber = this.currentLayerNumber;
	    		    this.application.ninja.currentDocument.tlCurrentLayersSelected = this.currentLayersSelected;


	    		    for (i = 0; i < hashLength; i++ ) {
	    		    	if (this.application.ninja.currentDocument.tlBreadcrumbHash[i].containerUuid === this.currentDocument.model.domContainer.uuid) {
	    		    		this.application.ninja.currentDocument.tlBreadcrumbHash[i].arrLayers = this.arrLayers;
	    		    		boolHash = true;
	    		    	}
	    		    }
	    		    if (boolHash === false) {
		    		    var newHash = {};
		    		    newHash.containerUuid = this.currentDocument.model.domContainer.uuid;
		    		    newHash.arrLayers = this.arrLayers;
		    		    this.application.ninja.currentDocument.tlBreadcrumbHash.push(newHash);
	    		    }
                }
	    		this.application.ninja.currentDocument.tlCurrentElementsSelected = this.currentElementsSelected;
			}
    	}
    },
    
    // Initialize Timeline cache in currentDocument.
    initTimelineCache: {
    	value: function() {
			// Initialize the currentDocument for a new set of timeline data.
			this.application.ninja.currentDocument.isTimelineInitialized = true;
			this.application.ninja.currentDocument.tlArrLayers = [];
    		this.application.ninja.currentDocument.tlCurrentSelectedContainer = this.currentDocument.model.domContainer;
    		this.application.ninja.currentDocument.tllayerNumber = this.currentLayerNumber;
    		this.application.ninja.currentDocument.tlCurrentLayerSelected = false;
    		this.application.ninja.currentDocument.tlCurrentLayersSelected = false;
    		this.application.ninja.currentDocument.tlCurrentElementsSelected = [];
            this.application.ninja.currentDocument.lockedElements = [];
    		this.application.ninja.currentDocument.tlBreadcrumbHash = [];
    	}
    },
    
    // Bind all document-specific events (pass in true to unbind)
    _bindDocumentEvents : {
        value: function(boolUnbind) {
			var arrEvents = ["elementAdded",
                             "elementsRemoved",
                             "selectionChange",
                             "tlZoomSlider"],
                i,
                arrEventsLength = arrEvents.length;

            if (boolUnbind) {
                for (i = 0; i < arrEventsLength; i++) {
                    this.eventManager.removeEventListener(arrEvents[i], this, false);
                }
            } else {
                for (i = 0; i < arrEventsLength; i++) {
                    this.eventManager.addEventListener(arrEvents[i], this, false);
                }
            }
        }
    },

    // Initialize the timeline, runs only once when the timeline component is first loaded
    initTimeline:{
        value:function () {
        	
        	// Get some selectors
            this.layout_tracks = this.element.querySelector(".layout-tracks");
            this.layout_markers = this.element.querySelector(".layout_markers");
            
            // Bind drag and drop event handlers
            this.container_layers.addEventListener("dragstart", this.handleLayerDragStart.bind(this), false);
            this.container_layers.addEventListener("dragend", this.handleLayerDragEnd.bind(this), false);
            this.container_layers.addEventListener("dragover", this.handleLayerDragover.bind(this), false);
            this.container_layers.addEventListener("drop", this.handleLayerDrop.bind(this), false);
            this.container_tracks.addEventListener("dragover", this.handleKeyframeDragover.bind(this), false);
            this.container_tracks.addEventListener("drop", this.handleKeyframeDrop.bind(this), false);
            
            // Bind the handlers for the config menu
            this.checkable_animated.addEventListener("click", this.handleAnimatedClick.bind(this), false);
            this.tl_configbutton.addEventListener("click", this.handleConfigButtonClick.bind(this), false);
            document.addEventListener("click", this.handleDocumentClick.bind(this), false);
            
            // Add some event handlers
            this.timeline_leftpane.addEventListener("click", this.handleTimelineLeftPanelClick.bind(this), false);
            this.layout_tracks.addEventListener("scroll", this.handleLayerScroll.bind(this), false);
            this.user_layers.addEventListener("scroll", this.handleLayerScroll.bind(this), false);
            this.end_hottext.addEventListener("changing", this.handleTrackContainerWidthChange.bind(this), false);
            this.playhead.addEventListener("mousedown", this.startPlayheadTracking.bind(this), false);
            this.playhead.addEventListener("mouseup", this.stopPlayheadTracking.bind(this), false);
            this.time_markers.addEventListener("click", this.updatePlayhead.bind(this), false);
            document.addEventListener("keydown", this.timelineLeftPaneKeydown.bind(this), false);
            document.addEventListener("keyup", this.timelineLeftPaneKeyup.bind(this), false);
            this.eventManager.addEventListener("updatedID", this.handleLayerIdUpdate.bind(this), false);
			this.checkable_lock.addEventListener("click",this.handleLockLayerClick.bind(this),false);
            this.checkable_visible.addEventListener("click",this.handleLayerVisibleClick.bind(this),false);
            this.play_button.addEventListener("click", this.handlePlayButtonClick.bind(this), false);
            this.addPropertyChangeListener("currentDocument.model.domContainer", this);
            
			// Start the panel out in disabled mode by default
			// (Will be switched on later, if appropriate).
            this.enablePanel(false);

            // Create the easing menu for future use.
            this.easingMenu = EasingMenuPopup;
        }
    },

    // Initialize the timeline for a document.
    // Called when a document is opened (new or existing), or when documents are switched.
    initTimelineForDocument:{
        value:function () {
            var myIndex;
            this.drawTimeMarkers();
            
            // Document switching
            // Check to see if we have saved timeline information in the currentDocument.
            if ((typeof(this.application.ninja.currentDocument.isTimelineInitialized) === "undefined")) {
                // No, we have no information stored.
                // This could mean we are creating a new file, OR are opening an existing file.
                
                // First, initialize the caches.
				this.initTimelineCache();
                this.temparrLayers = [];

				// That's all we need to do for a brand new file. 
                // But what if we're opening an existing document?
                if (!this.application.ninja.documentController.creatingNewFile && this.application.ninja.currentDocument.currentView !== "code") {
                    // Opening an existing document. If it has DOM elements we need to restore their timeline info
                    if (this.application.ninja.currentDocument.model.documentRoot.children[0]) {
                        // Yes, it has DOM elements. Loop through them and create a new object for each.
                        for (myIndex = 0; this.application.ninja.currentDocument.model.documentRoot.children[myIndex]; myIndex++) {
                            this._openDoc = true;
                            this.restoreLayer(this.application.ninja.currentDocument.model.documentRoot.children[myIndex]);
                        }
                    }
                }
                
                // Draw the repetition.
                this.arrLayers = this.temparrLayers;
                this.currentLayerNumber = this.arrLayers.length;
                this._ignoreNextContainerChange = true;
                this._currentDocumentUuid = this.application.ninja.currentDocument.uuid;
                
			} else if (this.application.ninja.currentDocument.setLevel) {
				// Information stored, but we're moving up or down in the breadcrumb.
				var i = 0,
					hash = this.application.ninja.currentDocument.tlBreadcrumbHash,
					hashLength = hash.length,
					boolHashed = false,
					parentNode = this.currentDocument.model.domContainer,
                	storedCurrentLayerNumber = this.application.ninja.currentDocument.tllayerNumber;
                	this.temparrLayers = [];

				// It's possible there is something stored in the breadcrumb hash in currentdocument, so check there first.
				for (i = 0; i < hashLength; i++ ) {
    		    	if (hash[i].containerUuid === this.currentDocument.model.domContainer.uuid) {
    		    		this.temparrLayers = hash[i].arrLayers
    		    		boolHashed = true;
    		    	}
    		    }
				
				// Possibly nothing was in the hash, fall back to old restoreLayer method.
				if (boolHashed === false) {
	                for (myIndex = 0; parentNode.children[myIndex]; myIndex++) {
	                    this._openDoc = true;
	                    this.restoreLayer(parentNode.children[myIndex]);
	                }
				}
				
                // Draw the repetition.
                this.arrLayers = this.temparrLayers;
                this.currentLayerNumber = storedCurrentLayerNumber;
                this.application.ninja.currentDocument.setLevel = false;
                this.resetMasterDuration();

            } else {
                // we do have information stored.  Use it.
                var i = 0, 
                	tlArrLayersLength = this.application.ninja.currentDocument.tlArrLayers.length;
                
                // Hack to ignore next container change event
                this._ignoreNextContainerChange = true;
                
                // We're reading from the cache, not writing to it.
            	this._boolCacheArrays = false;
            	
            	// We are about to redraw the layers and tracks for the first time, so they need to go through their 
            	// respective firstDraw routines.
                for (i = 0; i < tlArrLayersLength; i++) {
					this.application.ninja.currentDocument.tlArrLayers[i].layerData._isFirstDraw = true;
                }
                this.arrLayers = this.application.ninja.currentDocument.tlArrLayers;
                this.currentLayerNumber = this.application.ninja.currentDocument.tllayerNumber;
                this.currentLayersSelected = this.application.ninja.currentDocument.tlCurrentLayersSelected;
                this.currentElementsSelected = this.application.ninja.currentDocument.tlCurrentElementsSelected;
                this._currentDocumentUuid = this.application.ninja.currentDocument.uuid;


                // Are we only showing animated layers?
				if (this.application.ninja.currentDocument.boolShowOnlyAnimated) {
					// Fake a click.
					var evt = document.createEvent("MouseEvents");
					evt.initMouseEvent("click");
					this.checkable_animated.dispatchEvent(evt);
				}

				// Ok, done reading from the cache.
				this._boolCacheArrays = true;
				
				// Reset master duration
				this.resetMasterDuration();
            }
        }
    },

    // Clear the currently-displayed document (and its events) from the timeline.
    clearTimelinePanel:{
        value:function () {
            // Remove events
            this._bindDocumentEvents(true);

            // Remove every event listener for every selected tween in the timeline
            this.deselectTweens();

            // Reset visual appearance
            this.application.ninja.timeline.playhead.style.left = "-2px";
            this.application.ninja.timeline.playheadmarker.style.left = "0px";
            this.application.ninja.timeline.updateTimeText(0.00);
            this.timebar.style.width = "0px";
			this.checkable_animated.classList.remove("checked");
            this.currentLayerNumber = 0;
            this.currentLayersSelected = false;
            this.currentElementsSelected = [];
            this.selectedKeyframes = [];
            this.selectedTweens = [];
            this._captureSelection = false;
            this._openDoc = false;
            this.end_hottext.value = 25;
            this.millisecondsOffset = 1000;

            this.handleTrackContainerWidthChange();
            // Clear the repetitions
            if (this.arrLayers.length > 0) {
                this.arrLayers = [];
                this.arrLayers.length = 0;
            }
            this.resetMasterDuration();
        }
    },
    
    synchScrollbars: {
    	value: function(intScrollBy) {
    		this._areTracksCollapsing = this.layout_tracks.scrollTop - intScrollBy;
    		this.needsDraw = true;
    	}
    },

	// Select the layers whose indexes are passed in as arrSelectedIndexes.
	// Pass in an empty array to clear all selections.
    selectLayers:{
        value:function (arrSelectedIndexes) {
        	var i = 0,
        		j = 0,
        		arrLayersLength = this.arrLayers.length,
        		arrSelectedIndexesLength = arrSelectedIndexes.length,
        		arrSelectedLayers = false,
        		arrCurrentElementsSelected = [];

            // Deselect selected layers if they're not in arrSelectedIndexes.
            for (i = 0; i < arrLayersLength; i++) {
            	if (this.arrLayers[i].layerData.isSelected === true) {
            		if (arrSelectedIndexes.indexOf(i) < 0) {
						this.arrLayers[i].layerData.isSelected = false;
	            		this.triggerLayerBinding(i);
	            		
	            		// Check to see if this layer, that we're deselecting, has
	            		// any selected keyframes associated with it.  If it does, deselect them.
	            		for (j = 0; j < this.selectedTweens.length; j++) {
	            			var currentStageElement;
	            			if (typeof(this.selectedTweens[j].parentComponent.parentComponent.trackType) === "undefined") {
	            				currentStageElement = this.selectedTweens[j].parentComponent.parentComponent.stageElement; 
	            			} else {
	            				currentStageElement = this.selectedTweens[j].parentComponent.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent.stageElement;
	            			}
	            			if (this.arrLayers[i].layerData.stageElement === currentStageElement) {
	            				this.selectedTweens[j].deselectTween();
	            				this.selectedTweens.splice(j, 1);
	            			}
	            		}
            		}
            	}
            }
            if (this.currentLayersSelected !== false) {
            	this.currentLayersSelected = false;
            }
            
            // If we are actually going to be selecting things, create an empty array to use
            if (arrSelectedIndexesLength > 0) {
            	arrSelectedLayers = [];
            }
            
            // Loop through arrLayers and do the selection.
            for (i = 0; i < arrLayersLength; i++) {
            	if (arrSelectedIndexes.indexOf(i) > -1) {
                    if(!this.arrLayers[i].layerData.isLock){
                        this.arrLayers[i].layerData.isSelected = true;
                        this.arrLayers[i].isSelected = true;
                        this.triggerLayerBinding(i);
                        arrSelectedLayers.push(i);
                        arrCurrentElementsSelected.push(this.arrLayers[i].layerData.stageElement);
                    }else{
                        this.arrLayers[i].layerData.isSelected = false;
                        this.triggerLayerBinding(i);
                    }
            	}
            }

			// Store the selected layer information
			this.currentLayersSelected = arrSelectedLayers;
			this.currentElementsSelected = arrCurrentElementsSelected;
			
			// Tell the repetition what has been selected
            this.layerRepetition.selectedIndexes = arrSelectedIndexes;

            // Finally, reset the master duration.
            this.resetMasterDuration();
        }
    },
    
    // Get the indexes of layers that should be selected from
    // the elements that are currently selected on stage.
    getSelectedLayerIndexesFromStage: {
    	value: function() {
    		var arrIndexes = [],
    			i = 0, 
    			j = 0,
    			arrLayersLength = this.arrLayers.length,
    			selectedElementsLength = this.application.ninja.selectedElements.length;
    		
    		for (i = 0; i < selectedElementsLength; i++) {
    			var currentTestElement = this.application.ninja.selectedElements[i];
    			for (j = 0; j < arrLayersLength; j++) {
    				if (this.arrLayers[j].layerData.stageElement == currentTestElement) {
    					arrIndexes.push(j);
    				}
    			}
    		}
    		return arrIndexes;
    	}
    },
    
    // Update the selected layers based on what is selected on stage
    updateLayerSelection: {
    	value: function() {
    		var arrIndexes = this.getSelectedLayerIndexesFromStage();
    		this.selectLayers(arrIndexes);
    	}
    },
    
    // Update stage selection based on what layers are selected
    updateStageSelection: {
    	value: function() {
    		var arrSelectedElements = [],
    			i = 0,
    			j = 0,
    			arrLayersLength = this.arrLayers.length,
    			boolDoIt = false,
    			arrSelectedElementsLength = 0,
    			arrStageIndexes = this.getSelectedLayerIndexesFromStage(),
    			arrStageIndexesLength = arrStageIndexes.length;
    		
    		// Get the selected layers
    		for (i = 0; i < arrLayersLength; i++) {
    			if (this.arrLayers[i].layerData.isSelected === true) {
    				arrSelectedElements.push(this.arrLayers[i].layerData.stageElement);
    			}
    		}
    		arrSelectedElementsLength = arrSelectedElements.length;

			// check to see if we even need to continue...
    		if (arrSelectedElementsLength !== arrStageIndexesLength) {
    			boolDoIt = true;
    		} else {
    			for (i = 0; i < arrStageIndexesLength; i++) {
    				if (this.currentLayersSelected.indexOf(arrStageIndexes[i]) < 0) {
    					boolDoIt = true;
    				}
    			}
    		}
    		
    		if (boolDoIt === false) {
    			return;
    		}
    		
    		// Select the layers, or clear the selection if none were found
    		if (arrSelectedElementsLength > 0) {
    			this.application.ninja.selectionController.selectElements(arrSelectedElements);
    		} else {
    			this.application.ninja.selectionController.executeSelectElement();
    		}
    		
    	}
    },

    deselectTweens:{
        value:function () {
            for (var i = 0; i < this.selectedTweens.length; i++) {
                this.selectedTweens[i].deselectTween();
            }
            this.selectedTweens = null;
            this.selectedTweens = new Array();
        }
    },

    createStageElementsAt: {
        value:function (isPaste, arrElements) {
        	
        	var i = 0,
        		j = 0,
        		arrElementsLength = arrElements.length,
        		arrNewLayers = [],
        		arrNewLayersLength = 0,
        		stageElementName = "",
        		targetIndex = 0;
        	if (this.lastInsertionIndex !== false) {
        		targetIndex = this.lastInsertionIndex;
        		this.lastInsertionIndex = false;
        	}
        	
            // We will no longer have multiple things selected, so wipe that info out
            // if it isn't already gone.
            this.currentLayersSelected = false;
            this.currentElementsSelected = false;

			for (i = arrElementsLength-1; i >= 0; i--) {
				var thingToPush = this.createLayerTemplate();
				
				// Make up a layer name.
            	this.currentLayerNumber = this.currentLayerNumber + 1;
	            stageElementName="";
	            
	            // thingToPush is the template we just got.  Now fill it in.
	            thingToPush.layerData.layerName = stageElementName;
	            thingToPush.layerData.layerTag = "<" + arrElements[i].nodeName.toLowerCase() + ">";
	            thingToPush.layerData.layerID = this.currentLayerNumber;
	            thingToPush.parentElement = this.currentDocument.model.domContainer;
	            thingToPush.layerData.isSelected = true;
	            thingToPush.layerData._isFirstDraw = true;
	            thingToPush.layerData.created = true;
	            thingToPush.layerData.stageElement = arrElements[i];
	            thingToPush.layerData.isLock = false;
	            thingToPush.layerData.isHidden = false;
	            thingToPush.layerData.created = !isPaste;
	            thingToPush.created = !isPaste;

				if (this.checkable_animated.classList.contains("checked")) {
					thingToPush.layerData.isVisible = false;
				}
				this.arrLayers.splice(targetIndex, 0, thingToPush);
			}
        }
    },

    restoreLayer:{
        value:function (ele) {
            var stageElementName, 
            	thingToPush = this.createLayerTemplate();

            this.currentLayerNumber = this.currentLayerNumber + 1;

            if(ele.id){
                thingToPush.layerData.layerName = ele.id;
            }
            thingToPush.layerData.layerID = this.currentLayerNumber;
            thingToPush.layerData.layerTag = "<" + ele.nodeName.toLowerCase() + ">";
            thingToPush.parentElement = this.currentDocument.model.domContainer;
            if (this._openDoc) {
                thingToPush.layerData.stageElement = ele;
            }
            if (this.checkable_animated.classList.contains("checked")) {
            	thingToPush.layerData.isVisible = false;
            }
            
            // Initialize arrays for styles and their associated tracks;
            // These will be filled (if necessary) in TimelineTrack.
            thingToPush.layerData.arrLayerStyles = [];
            thingToPush.layerData.arrStyleTracks = [];

			// Add the layer to the repetition
            this.temparrLayers.splice(0, 0, thingToPush);
            thingToPush.layerData.trackPosition = this.temparrLayers.length - 1;
            thingToPush.layerData.layerPosition = this.temparrLayers.length - 1;

            this._openDoc = false;
        }
    },

    deleteLayers: {
    	value: function(arrElements) {
    		var i = 0, 
    			j = 0,
    			arrLayersLength = this.arrLayers.length,
    			arrElementsLength = arrElements.length;
    		
    		for (i = 0; i < arrElementsLength; i++) {
    			var currentTest = arrElements[i];
    			for (j = 0; j < arrLayersLength; j++) {
    				if (this.arrLayers[j].layerData.stageElement == currentTest) {
    					this.arrLayers.splice(j, 1);
    					// Super-secret magic trick: Now that we've spliced out an element,
    					// arrLayers.length is different. We need to update it.
    					arrLayersLength = this.arrLayers.length;
    				}
    			}
    		}
    		this.selectLayers([]);
    		this.resetMasterDuration();
    	}
    },

    resetMasterDuration:{
        value:function(){
            var trackDuration = 0,
            	arrLayersLength = this.arrLayers.length, 
            	i = 0;

            if (arrLayersLength > 0) {
            	for (i = 0; i < arrLayersLength; i++) {
            		var currLength = this.arrLayers[i].layerData.trackDuration;
            		if (currLength > trackDuration) {
            			trackDuration = currLength;
            		}
            	}
            }
            this.masterDuration = trackDuration;
        }
    },

    drawTimeMarkers:{
        value:function () {
            this.timeMarkerHolder = document.createElement("div");

            if(this.time_markers.children[0]){
               this.time_markers.removeChild(this.time_markers.children[0]);
            }

            this.time_markers.appendChild(this.timeMarkerHolder);
            var i;
            var totalMarkers = Math.floor(this.time_markers.offsetWidth / 80);
            for (i = 0; i < totalMarkers; i++) {
                var timeMark = document.createElement("div");
                var markValue = this.calculateTimeMarkerValue(i);
                timeMark.className = "timemark";
                timeMark.innerHTML = markValue;
                this.timeMarkerHolder.appendChild(timeMark);
            }
        }
    },

    calculateTimeMarkerValue:{
        value:function (currentMarker) {
            var currentMilliseconds = currentMarker * this.millisecondsOffset;
            return this.convertMillisecondsToTime(currentMilliseconds);
        }
    },

    updateTimeText:{
        value:function (millisec) {
            this.timetext.innerHTML = this.convertMillisecondsToTime(millisec);
        }
    },

    convertMillisecondsToTime:{
        value:function(millisec){
            var timeToReturn;
            var sec = (Math.floor((millisec / 1000))) % 60;
            var min = (Math.floor((millisec / 1000) / 60)) % 60;
            var milliSeconds = String(Math.round(millisec / 10));
            var returnMillisec = milliSeconds.slice(milliSeconds.length - 2, milliSeconds.length);
            var returnSec;
            var returnMin;
            if (sec < 10) {
                returnSec = "0" + sec;
            } else {
                returnSec = sec;
            }
            if (min < 10) {
                returnMin = "0" + min;
            } else {
                returnMin = min;
            }
            if (returnMillisec == "0") {
                returnMillisec = "0" + returnMillisec;
            }
            timeToReturn = returnMin + ":" + returnSec + ":" + returnMillisec;
            return timeToReturn;
        }
    },

	// Get the index where a layer should be inserted based on selection.
	// If nothing is selected, returns false.
	// Used by ElementController.addElement.
	getInsertionIndex: {
		value: function() {
			var i = 0, 
				currentLayersSelectedLength = this.currentLayersSelected.length,
				arrLayersLength = this.arrLayers.length,
				returnVal = arrLayersLength -1;
			if (returnVal === -1) {
				this.lastInsertionIndex = 0;
				return false;
			}
			if (this.currentLayersSelected === false) {
				this.lastInsertionIndex = 0;
				return false;
			}
			
			for (i = 0; i < arrLayersLength; i++) {
				if (this.arrLayers[i].layerData.isSelected) {
					returnVal = i;
				}
			}
			this.lastInsertionIndex = returnVal;
			return returnVal;
		}
	},

    getLayerIndexByID:{
        value:function (layerID, tempArr) {
            var i = 0,
                returnVal = false,
                arrLayersLength = this.arrLayers.length;

            if (tempArr) {
                var tempArrLength = this.temparrLayers.length;

                for (i = 0; i < tempArrLength; i++) {
                    if (this.temparrLayers[i].layerData.layerID === layerID) {
                        returnVal = i;
                    }
                }

            } else {
                for (i = 0; i < arrLayersLength; i++) {
                    if (this.arrLayers[i].layerData.layerID === layerID) {
                        returnVal = i;
                    }
                }
            }
            return returnVal;
        }
    },

    enablePanel:{
        value:function (boolEnable) {
            if (boolEnable) {
                this.timeline_disabler.style.display = "none";
            } else {
                this.timeline_disabler.style.display = "block";
            }
        }
    },

    buildDragHelper: {
    	value: function() {
    		var myContainer = document.createElement("div"),
    			i = 0, 
    			currentLayersSelectedLength = this.currentLayersSelected.length;

    		for (i = 0; i < currentLayersSelectedLength; i++) {
    			var currentClone = this.layerRepetition.childComponents[this.currentLayersSelected[i]].element.cloneNode(true);
    			currentClone.classList.add("layerSelected");
    			myContainer.appendChild(currentClone);
    		}

    		this._dragAndDropHelper = myContainer;
            this._dragAndDropHelper.style.opacity = 0.8;
            this._dragAndDropHelper.style.position = "absolute";
            this._dragAndDropHelper.style.top = "0px";
            this._dragAndDropHelper.style.left = "0px";
            this._dragAndDropHelper.style.zIndex = 700;
            
            this._dragAndDropHelper.style.width = window.getComputedStyle(this.container_layers, null).getPropertyValue("width");
            this._dragAndDropHelper.classList.add("timeline-dnd-helper");
    	}
    },

    // Trigger the layer/track data binding
    triggerLayerBinding : {
    	value: function(intIndex) {
            this.arrLayers[intIndex].layerData.triggerBinding = !this.arrLayers[intIndex].layerData.triggerBinding;
        }
    },

	getActiveLayerIndex: {
		value: function() {
			var i = 0,
				returnVal = false,
				arrLayersLength = this.arrLayers.length;
			for (i = 0; i < arrLayersLength; i++) {
				if (this.arrLayers[i].layerData.isSelected === true) {
					returnVal = i;
				}
			}
			return returnVal;
		}
	},
    /* === END: Controllers === */
    
    /* === BEGIN: Event Handlers === */
    handleChange: {
        value: function() {
            if(this.currentDocument && this.currentDocument.model.getProperty("domContainer")) {
                this.currentSelectedContainer = this.currentDocument.model.getProperty("domContainer");
            }
        }
    },

    handlePlayButtonClick:{
        value:function(ev){
            this.application.ninja.appModel.livePreview = !this.application.ninja.appModel.livePreview;

            if (this.application.ninja.appModel.livePreview) {
                this.play_button.classList.remove("playbutton");
                this.play_button.classList.add("pausebutton");

            } else {
                this.play_button.classList.remove("pausebutton");
                this.play_button.classList.add("playbutton");
            }
        }
    },

    handleKeyframeShortcut:{
        value:function(action){
            var tempEv = {};
            tempEv.offsetX = this.playheadmarker.offsetLeft;
            tempEv.actionType = action;

            if (this.currentLayersSelected === false) {
            	// we do not have a layer selected. We should growl at the user. For now, this will fail silently.
            	return;
            }
            
            // We need to get the correct layer(s).  For each currentElementSelected,
            // loop through trackRepetition.childComponents and compare to stageElement.
            // If they match, that's one of the components that needs the event.
            var i = 0, 
            	j = 0, 
            	currentElementsSelectedLength = this.currentElementsSelected.length,
            	trackRepLength = this.trackRepetition.childComponents.length,
            	arrTargetIndexes = [],
            	arrTargetIndexesLength = 0;
            	
            
            for (i = 0; i < trackRepLength; i++) {
            	var currentElement = this.trackRepetition.childComponents[i].stageElement;
            	for (j = 0; j < currentElementsSelectedLength; j++) {
            		if (currentElement === this.currentElementsSelected[j]) {
            			arrTargetIndexes.push(i);
            		}
            	}
            }
            arrTargetIndexesLength = arrTargetIndexes.length;

			// Now we have an array of things that need to handle the event.
            for (i = 0; i < arrTargetIndexesLength; i++) {
            	this.trackRepetition.childComponents[arrTargetIndexes[i]].handleKeyboardShortcut(tempEv);
            }
        }
    },

    handleTrackContainerWidthChange:{
        value:function () {
            this.container_tracks.style.width = (this.end_hottext.value * 80) + "px";
            this.master_track.style.width = (this.end_hottext.value * 80) + "px";
            this.time_markers.style.width = (this.end_hottext.value * 80) + "px";
            if (this.timeMarkerHolder) {
                this.time_markers.removeChild(this.timeMarkerHolder);
            }
            this.drawTimeMarkers();
        }
    },

    zoomTrackContainerWidthChange:{
        value:function () {

            this.tempValue = this.tempValue/1000;
            this.tempValue *= 30;

            this.container_tracks.style.width = (this.tempValue * 80) + "px";
            this.master_track.style.width = (this.tempValue * 80) + "px";
            this.time_markers.style.width = (this.tempValue * 80) + "px";
            if (this.timeMarkerHolder) {
                this.time_markers.removeChild(this.timeMarkerHolder);
            }
            this.drawTimeMarkers();


        }
    },

    handleLayerScroll: {
        value:function () {
        	this._areTracksScrolling = true;
        	this.needsDraw = true;
        	
        }
    },

    startPlayheadTracking:{
        value:function () {
            this.time_markers.onmousemove = this.updatePlayhead.bind(this);
        }
    },

    stopPlayheadTracking:{
        value:function () {
            this.time_markers.onmousemove = null;
        }
    },

    updatePlayhead:{
        value:function (event) {
            var clickedPosition = event.target.offsetLeft + event.offsetX;
            this.playhead.style.left = (clickedPosition - 2) + "px";
            this.playheadmarker.style.left = clickedPosition + "px";
            var currentMillisecPerPixel = Math.floor(this.millisecondsOffset / 80);
            var currentMillisec = currentMillisecPerPixel * clickedPosition;
            this.updateTimeText(currentMillisec);
        }
    },
	
	// Event handler for changes in stage selection.
    handleSelectionChange: {
        value:function (event) {
        	this.updateLayerSelection();
        }
    },

	handleTimelineLeftPanelClick: {
        value:function (event) {
            var ptrParent = nj.queryParentSelector(event.target, ".container-layer"),
            	i = 0,
            	arrLayers = document.querySelectorAll(".container-layer"),
            	arrLayersLength = arrLayers.length,
            	targetIndex = 0,
	            isAlreadySelected = false,
	            indexAlreadySelected = -5,
	            indexLastClicked = 0,
	            ua = navigator.userAgent.toLowerCase(),
				boolCommandControlKeyIsPressed = false;
			
			// Check to see if either the Command key (macs) or Control key (windows) is being pressed
			if (ua.indexOf("mac") > -1) {
				if (event.metaKey === true) {
					boolCommandControlKeyIsPressed = true;	
				}
			} else {
				if (this._isControlPressed === true) {
					boolCommandControlKeyIsPressed = true;
				}
			}

			
			// Did the mousedown event originate within a layer?
			if (ptrParent === false) {
				// No it did not.  Do nothing.
				return;
			}
			
			// Get the targetIndex, the index in the arrLayers of the 
			// layer that was just clicked on
            for (i = 0; i < arrLayersLength; i++) {
            	if (arrLayers[i] == ptrParent) {
            		targetIndex = i;
            	}
            }
            
            // Did we just click on a layer that's already selected?
			if (this.currentLayersSelected !== false) {
				for (i = 0; i < this.currentLayersSelected.length; i++) {
					if (this.currentLayersSelected[i] === targetIndex) {
						indexAlreadySelected = i;
					}
				}
			}
			if (indexAlreadySelected > -1) {
				isAlreadySelected = true;
			}
            
            // Now, do the selection based on all of that information.
            if (this.currentLayersSelected.length === 0) {
            	// Nothing selected yet, so just push the new index into the array.
            	this.currentLayersSelected.push(targetIndex);
            } else {
            	// Something is already selected.  What do do depends on whether
            	// or not other keys are pressed.
	            if (boolCommandControlKeyIsPressed === true) {
	            	// Control or Command key is being pressed, so we need to 
	            	// either add the current layer to selectedLayers
	            	// or remove it if it's already there.
					if (this.currentLayersSelected === false) {
						this.currentLayersSelected = [];
					}
	            	if (isAlreadySelected === false) {
	            		this.currentLayersSelected.push(targetIndex);
	            	} else {
	            		this.currentLayersSelected.splice(indexAlreadySelected, 1);
	            	}
	            	this.lastLayerClicked = targetIndex;
	            } else if (this._isShiftPressed === true) {
	            	// The shift key is being pressed.
	            	// Start by selecting the lastLayerClicked
					if (this.currentLayersSelected === false) {
						this.currentLayersSelected = [];
					}
					this.currentLayersSelected = [this.lastLayerClicked];
					// Add all the layers between lastLayerClicked and targetIndex
	            	if (targetIndex > this.lastLayerClicked) {
	            		for (i = this.lastLayerClicked+1; i <= targetIndex; i++) {
	            			this.currentLayersSelected.push(i);
	            		}
	            	} else if (targetIndex < this.lastLayerClicked) {
	            		for (i = targetIndex; i < this.lastLayerClicked; i++) {
	            			this.currentLayersSelected.push(i);
	            		}
	            	}
	            } else {
	            	// No key is pressed, so just select the element
	            	// and update lastLayerClicked
	            	this.currentLayersSelected = [targetIndex];
	            	this.lastLayerClicked = targetIndex;
	            }
            }
            this.selectLayers(this.currentLayersSelected);
            this.updateStageSelection();
        }
	},

	timelineLeftPaneKeydown: {
		value: function(event) {
			var ua = navigator.userAgent.toLowerCase(),
				boolIsMac = false;
			if (ua.indexOf("mac") > -1) {
				boolIsMac = true;
			}
			if (event.keyCode === 16) {
				// Shift key has been pressed
				this._isShiftPressed = true;
			}
			if ((event.keyCode === 17) && !boolIsMac) {
				// Control key has been pressed
				this._isControlPressed = true;
			}
		}
	},
    
	timelineLeftPaneKeyup: {
		value: function(event) {
			var ua = navigator.userAgent.toLowerCase(),
				boolIsMac = false;
			if (ua.indexOf("mac") > -1) {
				boolIsMac = true;
			}
			if (event.keyCode === 16) {
				// Shift key has been released
				this._isShiftPressed = false;
			}
			if ((event.keyCode === 17) && !boolIsMac) {
				// Control key has been released
				this._isControlPressed = false;
			}
			if (event.metaKey === false) {
				this._isControlPressed = false;
			}
		}
	},

    handleElementAdded:{
        value:function(event) {
        	var i = 0, 
    			targetIndex = 0;
        	// One or more elements have been added to the stage.
        	// We need to add them to the timeline.
        	if (typeof(event.detail.length) === "undefined") {
        		// This is a standard element creation event.
        		this.createStageElementsAt(false, [event.detail]);
        	} else {
        		// This is a paste action, because event.detail has more than one item in it.
        		this.createStageElementsAt(true, event.detail);
        	}
        	this.updateLayerSelection();
        }
    },

    handleElementsRemoved:{
        value:function (event) {
            this.deleteLayers(event.detail);
        }
    },

    handleElementReplaced:{
        value:function(event){
        	// TODO: Is this event even fired? It's in element-controller.
        }
    },

    handleConfigButtonClick: {
    	value: function(event) {
    		event.stopPropagation();
    		this.handleCheckableClick(event);
    		
    	}
    },
    
    handleDocumentClick: {
    	value: function(event) {
    		if (this.tl_configbutton.classList.contains("checked")) {
    			this.tl_configbutton.classList.remove("checked");
    		}
    		// 
    		if (this.currentOpenSpanMenu !== false) {
    			this.currentOpenSpanMenu.hideEasingMenu();
    			this.currentOpenSpanMenu = false;
    		}
    	}
    },
    
    handleAnimatedClick: {
    	value: function(event) {
    		if (typeof(this.application.ninja.currentDocument) === "undefined") {
    			return;
    		}
    		if (this.application.ninja.currentDocument == null) {
    			return;
    		}
    		this.handleCheckableClick(event);
    		this.application.ninja.currentDocument.boolShowOnlyAnimated = event.currentTarget.classList.contains("checked");
    		var boolHide = false,
    			i = 0,
    			arrLayersLength = this.arrLayers.length;
    		if (event.currentTarget.classList.contains("checked")) {
    			// Hide layers with isAnimated = false;
    			boolHide = true;
    		}
    		
    		for (i = 0; i < arrLayersLength; i++) {
    			if (boolHide) {
    				// Hide layers with isAnimated = false
    				if (this.arrLayers[i].layerData.isTrackAnimated === false) {
    					this.arrLayers[i].layerData.isVisible = false;
    					this.triggerLayerBinding(i);
    				}
    			} else {
    				this.arrLayers[i].layerData.isVisible = true;
    				this.triggerLayerBinding(i);
    			}
    		}
    		
    	}
    },
    
    handleCheckableClick: {
    	value: function(event) {
    		if (event.currentTarget.classList.contains("checked")) {
    			event.currentTarget.classList.remove("checked");
    		} else {
    			event.currentTarget.classList.add("checked");
    		}
    	}
    },

    handleLockLayerClick:{
        value:function(event){

           var arrLayersLength = this.arrLayers.length;
           var lockElementArrLength = this.application.ninja.currentDocument.lockedElements.length;
           var i = 0;

           if(event.currentTarget.classList.contains("checked")){
               event.currentTarget.classList.remove("checked");
               for(i=0;i<arrLayersLength;i++){
                   this.arrLayers[i].layerData.isLock = false;
                   this.arrLayers[i].layerData.isSelected = true;
                   for(var k = 0; k<lockElementArrLength; k++){
                     if(this.application.ninja.currentDocument.lockedElements[k] === this.application.ninja.timeline.arrLayers[i].layerData.stageElement){
                         this.application.ninja.currentDocument.lockedElements.splice(k,1);
                         break;
                     }
                   }

               }
           } else {
               for(i = 0;i < arrLayersLength;i++){
                   if(!this.arrLayers[i].layerData.isLock){
                       this.arrLayers[i].layerData.isLock = true;
                       this.arrLayers[i].layerData.isSelected = false;
                       this.application.ninja.currentDocument.lockedElements.push(this.arrLayers[i].layerData.stageElement);
                   }
                   this.selectLayers([]);

               }
               event.currentTarget.classList.add("checked");
           }
        }
    },

    handleLayerVisibleClick:{
        value:function(event){
           var arrLayersLength = this.arrLayers.length;
           var lockElementArrLength = this.application.ninja.currentDocument.lockedElements.length;
           var i = 0;

           if(event.currentTarget.classList.contains("checked")){
               event.currentTarget.classList.remove("checked");
               for(i = 0; i < arrLayersLength; i++){
                   this.arrLayers[i].layerData.isHidden = false;
                   this.arrLayers[i].layerData.stageElement.style.visibility = "visible";
                   for(var k=0;k<lockElementArrLength;k++){
                       if(this.application.ninja.currentDocument.lockedElements[k] === this.application.ninja.timeline.arrLayers[i].layerData.stageElement){
                           this.application.ninja.currentDocument.lockedElements.splice(k,1);
                           break;
                       }
                   }

               }
           } else {
               for(i = 0; i < arrLayersLength; i++){
                   if(!this.arrLayers[i].layerData.isHidden){
                       this.arrLayers[i].layerData.isHidden = true;
                       this.arrLayers[i].layerData.stageElement.style.visibility = "hidden";
                       this.application.ninja.currentDocument.lockedElements.push(this.arrLayers[i].layerData.stageElement);
                   }

               }
               event.currentTarget.classList.add("checked");
           }
        }
    },

	// A layer's ID has been updated in the property panel. We need to update
	// our layer.
	handleLayerIdUpdate: {
		value: function(event) {
			var i = 0,
				arrLayersLength = this.arrLayers.length; 
			for (i = 0; i < arrLayersLength; i++) {
				var myTest = this.arrLayers[i].layerData.stageElement;
				if (this.application.ninja.selectedElements[0] == myTest) {
					this.arrLayers[i].layerData.layerName = event.detail.id;
					this.arrLayers[i].layerName = event.detail.id;
					this.triggerLayerBinding(i);
				}
			}
		}
	},

    /* Layer drag and drop */
    handleLayerDragStart : {
    	value: function(event) {
            var dragIcon = document.createElement("img");
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('Text', this.identifier);
            // dragIcon.src = "/images/transparent.png";
            dragIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAA1JREFUGFdj+P//PwMACPwC/ohfBuAAAAAASUVORK5CYII="
            dragIcon.width = 1;
            event.dataTransfer.setDragImage(dragIcon, 0, 0);
            
            // Clone the element we're dragging
            this.buildDragHelper();
            
            // Get the offset 
    		var findYOffset = function(obj) {
				var curleft = curtop = 0;
				
				if (obj.offsetParent) {
					do {
							curleft += obj.offsetLeft;
							curtop += obj.offsetTop;
				
						} while (obj = obj.offsetParent);
				}
				return curtop;
    		}
    		this._dragAndDropHelperOffset = findYOffset(this.container_layers);
    		this._appendHelper = true;
    		this._deleteHelper = false;
    	}
    },
    
    handleLayerDragover: {
    	value: function(event) {
    		// If this isn't a layer event we don't do anything.
    		if (this.draggingType !== "layer") {
    			return;
    		}
    		var currPos = 0,
    			myScrollTest = ((event.y - (this._dragAndDropHelperOffset - this.user_layers.scrollTop)) + 28) - this.user_layers.scrollTop;
    		if ((myScrollTest < 60) && (this.user_layers.scrollTop >0)) {
    			this._scrollTracks = (this.user_layers.scrollTop - 10)
    		}
    		if ((myScrollTest < 50) && (this.user_layers.scrollTop >0)) {
    			this._scrollTracks = (this.user_layers.scrollTop - 20)
    		}
    		if ((myScrollTest > (this.user_layers.clientHeight + 10))) {
    			this._scrollTracks = (this.user_layers.scrollTop + 10)
    		}
    		if ((myScrollTest > (this.user_layers.clientHeight + 20))) {
    			this._scrollTracks = (this.user_layers.scrollTop + 20)
    			
    		}
    		currPos = event.y - (this._dragAndDropHelperOffset - this.user_layers.scrollTop)- 28;
    		this._dragAndDropHelperCoords = currPos + "px";
    		this.needsDraw = true;
    	}
    },
    
    handleLayerDragEnd : {
    	value: function(event) {
    		// If this isn't a layer event we don't do anything.
    		if (this.draggingType !== "layer") {
    			return;
    		}
    		this._deleteHelper = true;
    		this.needsDraw = true;
           
    	}
    },
    
    handleLayerDrop : {
    	value: function(event) {
    		// If this isn't a layer event we don't do anything.
    		if (this.draggingType !== "layer") {
    			return;
    		}
            event.stopPropagation();
            event.preventDefault();
            this._deleteHelper = true; 
            this.needsDraw = true;
    	}
    },
    
    /* Keyframe drag and drop */
    handleKeyframeDragover: {
    	value: function(event) {
    		// If this isn't a keyframe drag and drop event, we don't want to do anything.
    		if (this.draggingType !== "keyframe") {
    			return;
    		}
    		event.preventDefault();
    		var currPos = 0;

    		currPos = (event.x + this.layout_tracks.scrollLeft) - 277;
    		
    		// Prevent dragging beyond previous or next keyframe, if any
    		if (currPos < this.trackRepetition.childComponents[this.draggingTrackId]._keyframeMinPosition) {
    			currPos = this.trackRepetition.childComponents[this.draggingTrackId]._keyframeMinPosition;
    		}
    		if (currPos > this.trackRepetition.childComponents[this.draggingTrackId]._keyframeMaxPosition) {
    			currPos = this.trackRepetition.childComponents[this.draggingTrackId]._keyframeMaxPosition;
    		}

			// Automatic scrolling when dragged to edge of window
			if (currPos < (this.layout_tracks.scrollLeft + 10)) {
				this._scrollTracks = (this.layout_tracks.scrollLeft -10);
				this.needsDraw = true;
			}
			if (currPos > (this.layout_tracks.offsetWidth + this.layout_tracks.scrollLeft - 20)) {
				this._scrollTracks = (this.layout_tracks.scrollLeft +10);
				this.needsDraw = true;
			}

			// Set up values in appropriate track and set that track to draw.
    		this.trackRepetition.childComponents[this.draggingTrackId].dragAndDropHelperCoords = currPos + "px";
    		this.trackRepetition.childComponents[this.draggingTrackId].needsDraw = true;
    		return false;
    	}
    },
    
    handleKeyframeDrop: {
    	value: function(event) {
    		// If this isn't a keyframe drop event, we don't want to do anything.
    		if (this.draggingType !== "keyframe") {
    			return;
    		}
			event.stopPropagation();
			
			var currPos = (event.x + this.layout_tracks.scrollLeft) - 277,
				currentMillisecPerPixel = Math.floor(this.millisecondsOffset / 80),
				currentMillisec = 0,
				i = 0,
				trackIndex = this.draggingTrackId, 
				tweenIndex = this.trackRepetition.childComponents[trackIndex].draggingIndex;
				
			// Make sure drop happens between previous and next keyframe, if any.
    		if (currPos < this.trackRepetition.childComponents[trackIndex]._keyframeMinPosition) {
    			currPos = this.trackRepetition.childComponents[trackIndex]._keyframeMinPosition + 3;
    		}
    		if (currPos > this.trackRepetition.childComponents[trackIndex]._keyframeMaxPosition) {
    			currPos = this.trackRepetition.childComponents[trackIndex]._keyframeMaxPosition + 3;
    		}
    		
    		// Calculate the millisecond values, set repetitions, and update the rule.
    		currentMillisec = currentMillisecPerPixel * currPos;

			this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex].tweenData.spanWidth = 
				currPos - this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex - 1].tweenData.keyFramePosition;
				
			this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex].tweenData.keyFramePosition = currPos;
			this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex].tweenData.keyFrameMillisec = currentMillisec;
			
			this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex].tweenData.spanPosition = 
				currPos - this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex].tweenData.spanWidth;
				
			this.trackRepetition.childComponents[trackIndex].tweenRepetition.childComponents[tweenIndex].setData();
			
			if (tweenIndex < this.trackRepetition.childComponents[trackIndex].tweens.length -1) {
				var spanWidth = this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex +1].tweenData.keyFramePosition - currPos,
					spanPosition = currPos; 
				this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex +1].tweenData.spanWidth = spanWidth;
				this.trackRepetition.childComponents[trackIndex].tweens[tweenIndex +1].tweenData.spanPosition = currPos;
				this.trackRepetition.childComponents[trackIndex].tweenRepetition.childComponents[tweenIndex+1].setData();
			}
			this.trackRepetition.childComponents[trackIndex].tweenRepetition.childComponents[tweenIndex].selectTween();
			this.trackRepetition.childComponents[trackIndex].tweenRepetition.childComponents[tweenIndex].keyframe.selectKeyframe();
			this.trackRepetition.childComponents[trackIndex].updateKeyframeRule();
			
			// If this is the last keyframe, we'll need to update the track duration
			if (tweenIndex === (this.trackRepetition.childComponents[trackIndex].tweens.length-1)) {
				this.arrLayers[trackIndex].layerData.trackDuration = currentMillisec;
				this.resetMasterDuration();
			}
			return false;
    	}
    },

    handleTlZoomSlider: {
    		value: function(event) {

    	        var currentMilliSecPerPixel , currentMilliSec , clickPos;
    	        var i = 0,j=0,tweensLength,
                    trackLength = this.trackRepetition.childComponents.length;

                for(j=0;j<trackLength;j++){

                    tweensLength = this.trackRepetition.childComponents[j].trackData.tweens.length;

                    for (i = 0; i < tweensLength; i++) {

                        if (i === 0) {
                            // Exception: 0th item does not depend on anything
                            // If 0th tween is draggable, this will need to be fixed.
                            this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData.spanWidth=0;
                            this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData.spanPosition=0;
                            this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData.keyFramePosition=0;
                            this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData.keyFrameMillisec=0;

                        } else {
                            var prevKeyFramePosition = this.trackRepetition.childComponents[j].trackData.tweens[i - 1].tweenData.keyFramePosition,
                                myObj = {},
                                thing = {};

                            currentMilliSecPerPixel = Math.floor(this.application.ninja.timeline.millisecondsOffset / 80);
                            currentMilliSec = this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData.keyFrameMillisec;
                            clickPos = currentMilliSec / currentMilliSecPerPixel;

                            for (thing in this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData) {
                                myObj[thing] = this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData[thing];
                            }
                            myObj.spanWidth = clickPos - prevKeyFramePosition;
                            myObj.keyFramePosition = clickPos;
                            myObj.spanPosition = clickPos - (clickPos - prevKeyFramePosition);

                            this.trackRepetition.childComponents[j].trackData.tweens[i].tweenData = myObj;

                        }
                    }
                }
                this.application.ninja.timeline.zoomTrackContainerWidthChange();
    		}
    	}
    /* === END: Event Handlers === */

});