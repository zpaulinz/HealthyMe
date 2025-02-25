document.addEventListener("DOMContentLoaded", () => {
    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");
    const weightError = document.getElementById("weight-error");
    const heightError = document.getElementById("height-error");
    const errorMessage = document.getElementById("error-message");

    // Listening for Changes in The Weight and Height Fields
    weightInput.addEventListener("input", () => handleInputChange(weightInput, weightError, 'weight'));
    heightInput.addEventListener("input", () => handleInputChange(heightInput, heightError, 'height'));

    // Common Function for Handling Changes in Both Fields
    function handleInputChange(inputElement, errorElement, type) {
        validateInput(inputElement, errorElement, type);
        limitDecimalPlaces(inputElement); // Limiting Decimal Places
        removeSpaces(inputElement); // Removing Spaces
        limitIntegerLength(inputElement, 4); // Limiting Integer Length to 4 Digits
    }

    // Function to Limit the Number of Decimal Places to 1
    function limitDecimalPlaces(inputElement) {
        let value = inputElement.value;
        
        // If The Value Contains a Decimal Point and more than 2 decimal places
        if (value.includes('.') && value.split('.')[1].length > 1) {
            inputElement.value = parseFloat(value).toFixed(1);  
        }
    }

    // Function to remove spaces and shift the cursor to the left
    function removeSpaces(inputElement) {
        inputElement.value = inputElement.value.replace(/\s/g, ''); // Removing all spaces
    }

    // Function to limit the integer part to a specified length
    function limitIntegerLength(inputElement, maxLength) {
        let value = inputElement.value;
        
        // Stops entering new digits if the integer part exceeds maxLength
        let parts = value.split('.');
        if (parts[0].length > maxLength) {
            inputElement.value = parts[0].slice(0, maxLength) + (parts[1] ? '.' + parts[1] : '');  // Limits integer part to maxLength
        }
    }

    // Function to validate both weight and height
    function validateInput(inputElement, errorElement, type) {
        let value = inputElement.value.trim();
        value = value.replace(/,/g, '.');  // Replacing commas with periods

        // Validation based on type (weight or height)
        if (!/^(?!0(\.0+)?$)([1-9]\d*(\.\d+)?|\d(\.\d+)?$)/.test(value) || parseFloat(value) < 0.01 || parseFloat(value) > 1000) {
            errorElement.style.display = "block";
            inputElement.style.border = "2px solid red";
            return null;  // If the value is invalid
        } else {
            errorElement.style.display = "none";
            inputElement.style.border = "";
            
            // Returning the appropriate value based on type
            if (type === 'weight') {
                return parseFloat(value);  // Return numeric value
            } else if (type === 'height') {
                return parseFloat(value) / 100;  // Return value in meters
            }
        }
    }

    // Listening for form submission
    document.getElementById("bmi-form").addEventListener("submit", function(event) {
        event.preventDefault();

        // Get values from the form, validate weight and height
        let weight = validateInput(weightInput, weightError, 'weight');
        let height = validateInput(heightInput, heightError, 'height');

        // If Any Value is Null (invalid), Stop Form Submission
        if (weight === null || height === null || weight <= 0 || height <= 0) {
            errorMessage.style.visibility = "visible"; // Show Error If Any Value is Invalid
            return;
        } else {
            errorMessage.style.visibility = "hidden"; // Hide Error If Values Are Correct
        }
    
        // Calculate BMI
        let bmi = (weight / (height * height)).toFixed(2);

        const minIdealWeight = (18.5 * height * height);
        const maxIdealWeight = (24.99 * height * height);

        let category = "";

        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi >= 18.5 && bmi <= 24.99) {
            category = "Normal weight";
        } else if (bmi >= 25 && bmi < 29.99) { 
            category = "Overweight"; 
        } else if (bmi >= 30) { 
            category = "Obesity"; 
        }

        let roundedBmiDisplay = parseFloat(bmi).toFixed(2);  

        // Update the Message Based on Category
        let weightChangeMessage = "";
    
        if (category === "Underweight") {
            weightChangeMessage = `You need to gain ${parseFloat(minIdealWeight - weight).toFixed(1)} kg to reach normal weight (${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg).`;
        } else if (category === "Normal weight") {
            weightChangeMessage = `Nice work! You're doing great! Your weight's in the healthy range (${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg).`;
        } else if (category === "Overweight") {
            weightChangeMessage = `You need to lose ${parseFloat(weight - maxIdealWeight).toFixed(1)} kg to reach normal weight (${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg).`;
        } else if (category === "Obesity") {
            weightChangeMessage = `You need to lose ${parseFloat(weight - maxIdealWeight).toFixed(1)} kg to reach normal weight (${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg).`;
        }

        document.getElementById("bmi-result").textContent = `${category} (BMI ${roundedBmiDisplay})`;
        document.getElementById("bmi-to-normal").textContent = weightChangeMessage;

        let indicator = document.getElementById("bmi-indicator");
        
        const categoryWidth = 25; // 4 x 25% → 100% 
        let percentage = 0;

        // Normalizing BMI to match position on the scale
        if (bmi < 18.5) {
            percentage = (bmi / 18.5) * 25;  // Maps from 0 to 25% of the scale
        } else if (bmi >= 18.5 && bmi <= 24.99) {
            percentage = 25 + ((bmi - 18.5) / (24.99 - 18.5)) * 25;  // Maps from 25% to 50%
        } else if (bmi >= 25 && bmi <= 29.99) {
            percentage = 50 + ((bmi - 25) / (29.99 - 25)) * 25;  // Maps from 50% to 75%
        } else if (bmi >= 30) {
            percentage = 75 + ((bmi - 30) / 70) * 25;  // Maps from 75% to 100%
        }
        
        if (bmi > 100) {
            percentage = 100;
        }

        indicator.style.left = percentage + "%";
        indicator.style.visibility = "visible";  
    });
});
