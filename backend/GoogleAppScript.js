function doGet(e) {
  var formId = e.parameter.formId;
  var prefilledUrl = generatePrefilledUrlAuto(formId);
  return ContentService.createTextOutput(JSON.stringify({ prefilledUrl: prefilledUrl }))
    .setMimeType(ContentService.MimeType.JSON);
}

function generatePrefilledUrlAuto(formId) {
  // Form URL and ID

  console.log(formId)
  // var formId = "1hVv3j_-rDvEwHS7BFLksv74ACZw8gWQN9sGXcsjHqrg"; // Replace with your Google Form ID
  var form = FormApp.openById(formId);

  // Predefined values to fill in the form
  var predefinedAnswers = {
    "MULTIPLE_CHOICE": 0, // Index for the first option
    "CHECKBOX": 1, // Index for the second option
  };

  // Generate a form response object
  var formResponse = form.createResponse();

  // Loop through all the form items (questions)
  var items = form.getItems();

  items.forEach(function (item) {
    var itemType = item.getType();

    // Based on item type, get the response type and fill with predefined values
    switch (itemType) {
      case FormApp.ItemType.TEXT:
        formResponse.withItemResponse(item.asTextItem().createResponse(predefinedAnswers["TEXT"] || ""));
        break;

      case FormApp.ItemType.PARAGRAPH_TEXT:
        formResponse.withItemResponse(item.asParagraphTextItem().createResponse(predefinedAnswers["PARAGRAPH_TEXT"] || ""));
        break;

      case FormApp.ItemType.MULTIPLE_CHOICE:
        var mcqItem = item.asMultipleChoiceItem();
        var mcqChoices = mcqItem.getChoices();
        formResponse.withItemResponse(mcqItem.createResponse(mcqChoices[predefinedAnswers["MULTIPLE_CHOICE"]].getValue()));
        break;

      case FormApp.ItemType.CHECKBOX:
        var checkboxItem = item.asCheckboxItem();
        var checkboxChoices = checkboxItem.getChoices();
        formResponse.withItemResponse(checkboxItem.createResponse([checkboxChoices[predefinedAnswers["CHECKBOX"]].getValue()]));
        break;

      case FormApp.ItemType.SECTION_HEADER:
        Logger.log("Skipping section header.");
        // No action needed for section headers, they are just separators.
        break;

      // Add other case types if needed (e.g., DATE, SCALE)
      default:
        Logger.log("Unhandled item type: " + itemType);
        break;
    }
  });

  // Get the pre-filled form URL
  var prefilledUrl = formResponse.toPrefilledUrl();

  prefilledUrl = prefilledUrl.replace("viewform", "formResponse?&submit=Submit")

  Logger.log("Pre-filled URL: " + prefilledUrl);
  return prefilledUrl;
}

generatePrefilledUrlAuto("1hVv3j_-rDvEwHS7BFLksv74ACZw8gWQN9sGXcsjHqrg")