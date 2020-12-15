define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var BranchingScenarioView = ComponentView.extend({

    events: {
      'click .js-branching-choice-click': 'onChoiceClicked',
      'click .js-branching-continue-click': 'onContinueClicked',
      'click .js-branching-restart-click': 'onRestartClicked'
    },

    _currentPath: null,
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
      // show the first step of the scenario
      this.$('.branchingScenario__widget').eq(0).addClass('is-visible');
      var pathID = this.$('.branchingScenario__widget').eq(0).data('path');
      this._currentPath = pathID;
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    onChoiceClicked: function(event) {
        // set the buttons to diabled
        $(event.currentTarget).parent().children('.branchingScenario__btn').prop('disabled', true); 
        // show which option was selected
        $(event.currentTarget).addClass('is-chosen');
        // set the current data path element to inviisble & the next data path element to visible
        var pathID = $(event.currentTarget).data('path');
        
        if(pathID === this.model.get('_completeID')) {
          this.onContinueClicked();
        }
        if(this.model.get('_displayAll') === false) {
          this.$('[data-path="' + this._currentPath + '"]').removeClass('is-visible');
        }
        
        this.$('[data-path="' + pathID + '"]').addClass('is-visible');
      
        // const el = document.getElementById('' + pathID + '');
        // const scrollTo = el.scrollTop();
        // window.scroll(scrollTo, 0);

        //audio?
        if (Adapt.config.get('_sound')._isActive === true) {
          this.model.get('_items').forEach((item) => {
            if (item._id === pathID) {
              if (item._audio) {
                Adapt.trigger('audio:partial', {src: item._audio._src});
              }
            }
          });
        }

        this._currentPath = pathID;


        const divName = "#" + pathID + "";
        const element = this.$(divName); // document.querySelector(divName);
        // scroll to element
        // if(this.model.get('_displayAll') === true) {
        //   setTimeout(function(){
        //     element.scrollIntoView(false);
        //   }, 100);
        // }

    },

    onContinueClicked: function() {
      this.setCompletionStatus();
      this.$('.branchingScenario__continue').removeClass('is-visible');
    },

    onRestartClicked: function() {
      this.$('.branchingScenario__widget').removeClass('is-visible');
      this.$('.branchingScenario__buttons-end').removeClass('is-visible');
      this.$('.branchingScenario__widget').eq(0).addClass('is-visible');
      this.$('.branchingScenario__btn').prop('disabled', false); 
      this.$('.branchingScenario__btn').removeClass('is-chosen'); 

      var pathID = this.$('.branchingScenario__widget').eq(0).data('path');
      this._currentPath = pathID;

      if (Adapt.config.get('_sound')._isActive === true) {
        this.model.get('_items').forEach((item) => {
          if (item._id === pathID) {
            if (item._audio) {
              Adapt.trigger('audio:partial', {src: item._audio._src});
            }
          }
        });
      }
    }

  },
  {
    template: 'branchingScenario'
  });

  return Adapt.register('branchingScenario', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: BranchingScenarioView
  });
});
