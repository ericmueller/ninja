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

var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

var Keyframe = exports.Keyframe = Montage.create(Component, {

    // ==== Begin models
    hasTemplate:{
        value: true
    },

    _position:{
        value:0
    },

    position:{
        serializable:true,
        get:function(){
            return this._position;
        },
        set:function(value){
            this._position = value;
            this.needsDraw = true;
        }
    },

    _isSelected:{
        value:false
    },

    isSelected:{
        serializable:true,
        get:function(){
            return this._isSelected;
        },
        set:function(value){
            this._isSelected = value;
            this.needsDraw = true;
        }
    },
    // ==== End Models

    // ==== Begin Draw cycle methods
    prepareForDraw:{
        value:function(){
            this.element.addEventListener("click", this, false);

            // Drag and drop event handlers
            this.element.addEventListener("mouseover", this.handleMouseover.bind(this), false);
            this.element.addEventListener("mouseout", this.handleMouseout.bind(this), false);
            this.element.addEventListener("dragstart", this.handleDragstart.bind(this), false);
            this.element.addEventListener("dragend", this.handleDragend.bind(this), false);
        }
    },

    draw:{
        value:function(){
            if(this.isSelected){
                this.element.classList.add("keyframeSelected");
                this.application.ninja.timeline.selectedStyle = this.parentComponent.parentComponent.parentComponent.trackEditorProperty;
            }else{
                this.element.classList.remove("keyframeSelected");
            }
            this.element.style.left = (this.position - 5) + "px";
        }
    },
    // ==== End Draw cycle methods

    // ==== Begin Event handlers
    handleClick:{
        value:function(ev){
            this.selectKeyframe();
            ev.stopPropagation();
        }
    },

	handleMouseover: {
		value: function(event) {
			this.element.draggable = true;
		}
	},

	handleMouseout: {
		value: function(event) {
			this.element.draggable = false;
		}
	},

	handleDragstart: {
		value: function(event) {
            event.dataTransfer.setData('Text', 'Keyframe');
            var i = 0,
            	tweenRepetitionLength,
            	myTrack,
            	myIndex = null;
            if (typeof(this.parentComponent.parentComponent.parentComponent.tweenRepetition) !== "undefined") {
                myTrack = this.parentComponent.parentComponent.parentComponent;
            } else {
                myTrack = this.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent;
            }
            tweenRepetitionLength = myTrack.tweenRepetition.childComponents.length;
            for (i = 0; i < tweenRepetitionLength; i++) {
            	if (myTrack.tweenRepetition.childComponents[i].uuid === this.parentComponent.uuid) {
            		myIndex = i;
            	}
            }
            myTrack.draggingIndex = myIndex;
            this.selectKeyframe();
		}
	},

	handleDragend: {
		value: function(event) {
			this.parentComponent.isDragging = false;
		}
	},
    // ==== End Event handlers

    // === Begin Controllers
    selectKeyframe:{
        value:function(){
            if(this.isSelected){
                return;
            }
            if(this.parentComponent.parentComponent.parentComponent.trackType == "position"){
                var tweenID = this.parentComponent.tweenID;
                var mainTrack = this.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent.parentComponent;
                mainTrack.childComponents[0].childComponents[tweenID].childComponents[0].selectKeyframe();
                return;
            }
            this.isSelected=true;
            //this.element.style.left = (this.position - 6) + "px"; Moved to draw cycle.
            this.application.ninja.timeline.selectedStyle = this.parentComponent.parentComponent.parentComponent.trackEditorProperty;
            this.parentComponent.selectTween();
        }
    },

    deselectKeyframe:{
        value:function () {
            this.isSelected = false;
            // this.element.style.left = (this.position - 5) + "px"; Moved to draw cycle
        }
    }
    // ==== End Controllers
});
