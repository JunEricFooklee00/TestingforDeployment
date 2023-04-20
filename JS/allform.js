//FORECASTING
// Get references to the form elements and result div
const UnitQuantityInput = document.getElementById('Unit Quantity');
const UnitHrInput = document.getElementById('Unit Hour');

const ModelSelectField = document.getElementById('Model Select');
const ProdRatioField = document.getElementById('Productivity Ratio');
const unitLabel = document.getElementById("unit");
  
const predictButton = document.getElementById('predictButton');
const predictionResult = document.getElementById('predictionResult');

//click event listener for Productivity field change
ModelSelectField.addEventListener("change", () => {
    const selectedOptionValue = ModelSelectField.value;
    let productivityRatioValue = "";

    switch (selectedOptionValue) {
      case "B2 - Carpentry Works for Main Counter":
        productivityRatioValue = "6";
        unitLabel.innerHTML = " sq.m";
        break;

      case "C1 - Stainless Works for Main Counter":
        productivityRatioValue = "3";
        unitLabel.innerHTML = " sq.m";
        break;

      case "D2 - Pipeline and Fixture Installation":
        productivityRatioValue = "8";
        unitLabel.innerHTML = " ln.m";
        break;

      case "D3 - Drainage Pipeline Installation":
        productivityRatioValue = "10";
        unitLabel.innerHTML = " ln.m";
        break;

      case "G1 - Plain Concrete Surfaces (Surface Prep - Primer - Finish Coat)":
        productivityRatioValue = "4.32";
        unitLabel.innerHTML = " sq.m";
        break;

      case "G2 - Wooden / Metal Surfaces (Surface Prep - Primer - Finish Coat)":
        productivityRatioValue = "3.6";
        unitLabel.innerHTML = " sq.m";
        break;

        default:
            result = null;
            unit = "";
            break;
    }
    ProdRatioField.value = productivityRatioValue;
  });

// Add a click event listener to the predict button
predictButton.addEventListener('click', predict);

// Define the predict function
async function predict() {

    // Get the values from the input fields
        let result = 0;
        const input1 = result;
        const input2 = Number(UnitQuantityInput.value);

        var input3 = Number(UnitHrInput.value);
        //Convert UnitDays x 8hours
        input3 = (input3 * 8 );
        console.log(input3); 
        const modelSelect = ModelSelectField.value;

    switch (modelSelect) {
        case "B2 - Carpentry Works for Main Counter":
          var RateOfWork = 2.6667;
          result = (RateOfWork * input2) / input3;
          break;
  
        case "C1 - Stainless Works for Main Counter":
          RateOfWork = 5.33333;
          result = (RateOfWork * input2) / input3;
          break;
  
        case "D2 - Pipeline and Fixture Installation":
          RateOfWork = 1;
          result = (RateOfWork * input2) / input3;
          break;
  
        case "D3 - Drainage Pipeline Installation":
          RateOfWork = 0.8;
          result = (RateOfWork * input2) / input3;
          break;
  
        case "G1 - Plain Concrete Surfaces (Surface Prep - Primer - Finish Coat)":
          RateOfWork = 0.54;
          var specificproductivityRatioValue = 4.32;
          result = input2 / (input3 * specificproductivityRatioValue);
          break;
  
        case "G2 - Wooden_Metal Surfaces (Surface Prep - Primer - Finish Coat)":
          RateOfWork = 0.45;
          var specificproductivityRatioValue = 3.96;
          result = input2 / (input3 * specificproductivityRatioValue);
          break;
  
  
          default:
              result = null;
              unit = "";
              break;
      }

    if (result === null) {
        console.log("Please select a valid option for the Model Select field.");
        return;
    }


    // Load the Keras model based on the selected option
    console.log('Loading model...');
    const modelUrl = `models/${modelSelect}/model.json`;
    const model = await tf.loadLayersModel(modelUrl);

    if (model) {
        console.log('Model loaded successfully!');
    } else {
        console.log('Error: failed to load model.');
        return;
    }

    //Pre-processing Techniques
    const preprocessedDataUrl = `models/${modelSelect}/preprocessed_data.json`;
    const preprocessedDataResponse = await fetch(preprocessedDataUrl);
    const preprocessedData = await preprocessedDataResponse.json();

    if (preprocessedData) {
        console.log('Preprocessed data loaded successfully!');
    } else {
        console.log('Error: failed to load preprocessed data.');
        return;
    }

    //  Scale the input2 value using the MinMaxScaler technique
    // const minVal = Math.min(...preprocessedData);
    // const maxVal = Math.max(...preprocessedData);
    // const input2Scaled = (input2 - minVal) / (maxVal - minVal);
  
    //model prediction
    // Create a tensor with the input values
    // Define the input tensor based on the modelSelect variable with Normalization Technique

    let inputTensor;
    inputTensor = tf.tensor2d([[input1, input2, input3]], [1, 3]);
    
    // Call the predict function on the model with the input tensor
    const prediction = model.predict(inputTensor);

    console.log(prediction)

    // Get the prediction value as a scalar
    const predictionValue = prediction.dataSync()[0];

    // Round off the prediction value based on the given condition
    const roundedPredictionValue = (predictionValue % 1 <= 0.44) ? 
        Math.floor(predictionValue) : Math.round(predictionValue);

    console.log(" The predicted value is",predictionValue)
    // Display the result on the page
    predictionResult.innerHTML = `Your predicted number of worker for the ${modelSelect} is ${roundedPredictionValue}, Please decided if the number is enough.`;

    // Clean up memory by disposing of the tensor and the model
    inputTensor.dispose();
    model.dispose();
}

// RECOMMENDATION FUNCTIONS
// Client-side code
let inputSetCount = document.querySelectorAll("[name^='Recommend']").length;

function addInputSet() {
    const inputSets = document.getElementById("input-sets");

    // Check if maximum number of input sets is reached
    if (inputSetCount >= document.getElementById("Recommend").options.length) {
        alert("Maximum number of input sets reached!");
        return;
    }

    //create input-sets
    const newInputSet = document.createElement("div");

    newInputSet.className = "input-set";

    const recommendLabel = document.createElement("label");
    recommendLabel.htmlFor = `Recommend ${inputSetCount}`;
    recommendLabel.innerText = "Find the optimal worker:";
    newInputSet.appendChild(recommendLabel);

    const recommendSelect = document.createElement("select");
    recommendSelect.name = `Recommend ${inputSetCount}`;
    newInputSet.appendChild(recommendSelect);

    const recommendBr = document.createElement("br");
    newInputSet.appendChild(recommendBr);

    const numWorkerLabel = document.createElement("label");
    numWorkerLabel.htmlFor = `Number of Worker ${inputSetCount}`;
    numWorkerLabel.innerText = "What is the Number of Forecasted worker:";
    newInputSet.appendChild(numWorkerLabel);

    const numWorkerInput = document.createElement("input");
    numWorkerInput.type = "number";
    numWorkerInput.name = `Number of Worker ${inputSetCount}`;
    newInputSet.appendChild(numWorkerInput);

    const numWorkerBr = document.createElement("br");
    newInputSet.appendChild(numWorkerBr);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.onclick = function() { 
        deleteInputSet(this)
        updateRecommend()
    }

    deleteButton.innerText = "Delete Set"
    newInputSet.appendChild(deleteButton)

    inputSets.appendChild(newInputSet)
    inputSetCount++

    // Update the "Recommend" select options in all input sets
    updateRecommend()
}

function deleteInputSet() {
    const inputSets = document.querySelectorAll(".input-set");
    if (inputSets.length <= 1) {
      return;
    }
    
    const inputSet = inputSets[inputSets.length - 1];
    inputSet.parentNode.removeChild(inputSet);
    inputSetCount--;
    
    // Update the "Recommend" select options in all input sets
    updateRecommend();
}

async function updateRecommend() {
    const inputSets = document.querySelectorAll(".input-set");

    for (let i = 0; i < inputSets.length; i++) {
        const recommend = inputSets[i].querySelector(`[name^='Recommend']`);
        const scopeOfWorks = document.getElementById("Scope of Works").value;

        if (recommend) {
            recommend.innerHTML = "";
            if (scopeOfWorks === "B2 - Carpentry Works for Main Counter") {
                count = 0; // reset count
                const carpenterOption = document.createElement("option");
                carpenterOption.value = "Carpenter";
                carpenterOption.text = "Carpenter";
                recommend.add(carpenterOption);

                const laborHelperOption = document.createElement("option");
                laborHelperOption.value = "Labor Helper";
                laborHelperOption.text = "Labor Helper";
                recommend.add(laborHelperOption);
            } else if (scopeOfWorks === "C1 - Stainless Works for Main Counter") {
                count = 0; // reset count
                const welderOption = document.createElement("option");
                welderOption.value = "Welder";
                welderOption.text = "Welder";
                recommend.add(welderOption);

                const laborHelperOption = document.createElement("option");
                laborHelperOption.value = "Labor Helper";
                laborHelperOption.text = "Labor Helper";
                recommend.add(laborHelperOption);
            } else if (scopeOfWorks === "D2 - Pipeline and Fixture Installation" || scopeOfWorks === "D3 - Drainage Pipeline Installation") {
                count = 0; // reset count
                const plumberOption = document.createElement("option");
                plumberOption.value = "Plumber";
                plumberOption.text = "Plumber";
                recommend.add(plumberOption);

                const laborHelperOption = document.createElement("option");
                laborHelperOption.value = "Labor Helper";
                laborHelperOption.text = "Labor Helper";
                recommend.add(laborHelperOption);
            } else if (scopeOfWorks === "E - Masonry / Concrete Works") {
                count = 0; // reset count
                const masonOption = document.createElement("option");
                masonOption.value = "Mason";
                masonOption.text = "Mason";
                recommend.add(masonOption);

                const laborHelperOption = document.createElement("option");
                laborHelperOption.value = "Labor Helper";
                laborHelperOption.text = "Labor Helper";
                recommend.add(laborHelperOption);
            } else if (scopeOfWorks === "F - Electrical Works") {
                count = 0; // reset count
                const electricianOption = document.createElement("option");
                electricianOption.value = "Electrician";
                electricianOption.text = "Electrician";
                recommend.add(electricianOption);

                const laborHelperOption = document.createElement("option");
                laborHelperOption.value = "Labor Helper";
                laborHelperOption.text = "Labor Helper";
                recommend.add(laborHelperOption);
            } else if (scopeOfWorks === "G1 - Plain Concrete Surfaces (Surface Prep - Primer - Finish Coat)" || scopeOfWorks === "G2 - Wooden_Metal Surfaces (Surface Prep - Primer - Finish Coat)") {
                count = 0; // reset count
                const painterOption = document.createElement("option");
                painterOption.value = "Painter";
                painterOption.text = "Painter";
                recommend.add(painterOption);

                const laborHelperOption = document.createElement("option");
                laborHelperOption.value = "Labor Helper";
                laborHelperOption.text = "Labor Helper";
                recommend.add(laborHelperOption);
            }
    }
    }
}

async function sendData() {
    const inputSets = document.querySelectorAll(".input-set");
  
    inputSets.forEach(async (inputSet) => {
      const recommendSelect = inputSet.querySelector("select[name^='Recommend']");
      const numWorkerInput = inputSet.querySelector("input[name^='Number of Worker']");
      const recommendValue = recommendSelect.value;
      const numWorkerValue = numWorkerInput.value;
  
      if (recommendValue && numWorkerValue) {
        console.log('Sending data to API endpoint: ', { recommend: recommendValue, numWorkers: numWorkerValue });
  
        const response = await fetch('/recommendation', {
          method: 'POST',
          body: JSON.stringify({ recommend: recommendValue, numWorkers: numWorkerValue }),
          headers: { 'Content-Type': 'application/json' }
        });
  
        if (!response.ok) {
          throw new Error('Failed to send data to API endpoint');
        }
  
        const matchedProfiles = await response.json();
        console.log('Matched profiles:', matchedProfiles);
        displayMatchedProfiles(matchedProfiles);
      }
    });
  }
  
  function displayMatchedProfiles(matchedProfiles) {
    const matchedProfilesList = document.getElementById("matched-profiles");
    matchedProfilesList.innerHTML = "";

    // Check if matchedProfiles is an array
    if (Array.isArray(matchedProfiles)) {
        const list = document.createElement("ul");

        matchedProfiles.forEach((profile) => {
            const listItem = document.createElement("li");

            const fullName = `${profile.first_name} ${profile.last_name}`;
            const profileInfo = `${fullName}, ${profile.address}, ${profile.Profile}, Rating: ${profile.Rating}, Distance: ${profile.distance} km`;

            listItem.innerText = profileInfo;
            list.appendChild(listItem);
        });

        matchedProfilesList.appendChild(list);
    }
}