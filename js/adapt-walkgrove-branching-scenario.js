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
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
      // show the first step of the scenario
      this.$('.branchingScenario__widget').eq(0).addClass('is-visible');
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
        // set the data path element to visible
        var pathID = $(event.currentTarget).data('path');
        this.$('[data-path="' + pathID + '"]').addClass('is-visible');
      
        // const el = document.getElementById('' + pathID + '');
        // const scrollTo = el.scrollTop();
        // window.scroll(scrollTo, 0);

        const divName = "#" + pathID + "";
        const element = document.querySelector(divName);
        // scroll to element
        setTimeout(function(){
          element.scrollIntoView(false);
         }, 100);

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
