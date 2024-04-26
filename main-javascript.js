import { createClient } from "https://esm.sh/@supabase/supabase-js";
const supabaseUrl = 'https://bgieveocrzkpazulvhch.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWV2ZW9jcnprcGF6dWx2aGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwNjI0NDcsImV4cCI6MjAyNzYzODQ0N30.mxVAfUdKKa3P_Xut9YmIyXOoa0_wQ_orG437hdPqsQo";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
    async function submitPeople(form) {
        var name = form.name.value;
        var driverLicense = form.driverLicense.value;
        let error = null;
        let data = null;

        const dottedSpace = document.querySelector(".dottedSpace");
        dottedSpace.style.display = "none";

        const table = document.getElementById("results")
        table.innerHTML = "";

        if (name && driverLicense) {
            const message = document.getElementById("message");
            message.innerHTML = "<b>Either search by driver's name OR driver's license</b>"
            console.log("Error: Cannot search by both driver's name and license");
            return;
        }
        else if (name && !driverLicense) {
            const { data: data1, error: error1 } = await supabase
                .from("People")
                .select("*")
                .or(`Name.ilike.*${name}*, Name.ilike.*${name}*`);

            data = data1;
            error = error1;
        }
        else if (driverLicense && !name) {
            const { data: data1, error: error1 } = await supabase
                .from("People")
                .select("*")
                .eq("LicenseNumber", driverLicense);
            data = data1;
            error = error1;
        }
        else {
            const message = document.getElementById("message");
            message.innerHTML = "<b>Either search by driver's name OR driver's license</b>"
            return;
        }

        const message = document.getElementById("message");
        message.innerHTML = "";

        if (error) {
            console.error("Error fetching driver:", error);
            return;
        }
        else if (data.length == 0) {
            console.log("Driver not found");

            message.innerHTML = "<b>Driver not found</b>";
            const mainElement = document.querySelector("main");
            mainElement.appendChild(message);
            return;
        }


        // create header
        const header = document.createElement("tr");
        for (const column in data[0]) {
            const columnHeader = document.createElement("th");
            columnHeader.textContent = column;
            header.appendChild(columnHeader);
        }

        table.appendChild(header);

        // create records
        for (let i = 0; i < data.length; i++) {
            const div = document.createElement("div");
            const record = document.createElement("tr");
            for (const column in data[0]) {
                const columnData = document.createElement("td");
                columnData.textContent = data[i][column];
                record.appendChild(columnData);
            }
            record.appendChild(div)
            table.appendChild(record);
        }

        message.innerHTML = "<b>Search successful</b>";
    }

    async function submitVehicle(form) {
        var regPlate = form.regPlate.value;

        const dottedSpace = document.querySelector(".dottedSpace");
        dottedSpace.style.display = "none";

        const table = document.getElementById("results")
        table.innerHTML = "";

        const message = document.getElementById("message");
        message.innerHTML = "";


        if (!regPlate) {
            console.error("No plate entered");
            message.innerHTML = "<b>Registration plate required</b>"
            return;
        }
        const { data, error } = await supabase
            .from("Vehicles")
            .select("VehicleID, Make, Model, Colour, People(Name, LicenseNumber)")
            .ilike("VehicleID", `%${regPlate}%`);

        if (error) {
            console.error("Error fetching vehicle:", error);
            return;
        }
        else if (data.length == 0) {
            console.log("Vehicle not found");

            message.innerHTML = "<b>Vehicle not found</b>";
            const mainElement = document.querySelector("main");
            mainElement.appendChild(message);
            return;
        }

        // create header
        const header = document.createElement("tr");

        for (const column in data[0]) {

            if (column != "People") {
                const columnHeader = document.createElement("th");
                columnHeader.textContent = column;
                header.appendChild(columnHeader);
            }
            else {
                const columnHeader = document.createElement("th");
                columnHeader.textContent = "Name";
                header.appendChild(columnHeader);

                const columnHeader2 = document.createElement("th");
                columnHeader2.textContent = "LicenseNumber";
                header.appendChild(columnHeader2);
            }
        }



        table.appendChild(header);

        // create records
        for (let i = 0; i < data.length; i++) {

            const record = document.createElement("tr");

            for (const column in data[0]) {
                if (data[i][column]) {
                    if (column != "People") {
                        const columnData = document.createElement("td");
                        columnData.textContent = data[i][column];
                        record.appendChild(columnData);
                    }
                    else {

                        const columnData = document.createElement("td");
                        columnData.textContent = data[i][column].Name;
                        record.appendChild(columnData);

                        const columnData2 = document.createElement("td");
                        columnData2.textContent = data[i][column].LicenseNumber;
                        record.appendChild(columnData2);
                    }
                }
            }
            table.appendChild(record);
        }
    }

    async function addVehicle(form) {
        var regPlate = form.regPlate.value;
        var make = form.make.value;
        var model = form.model.value;
        var colour = form.colour.value;
        var ownerID = form.ownerID.value;

        const { data, error: error1 } = await supabase
            .from("People")
            .select("PersonID")
            .eq("PersonID", ownerID)

        if (error1) {
            console.error("Error creating vehicle:", error);
            return;
        }
        // create new person
        else if (data.length == 0) {
            form.action = "add-person.html";
            form.method = "GET";
            form.addVehicle.type = "submit"
            form.submit();
        }
        else {
            const { error } = await supabase
                .from("Vehicles")
                .insert({ VehicleID: regPlate, Make: make, Model: model, Colour: colour, OwnerID: ownerID })

            if (error) {
                console.log("Error adding vehicle");
                return;
            }

            const success = document.createElement("p");

            success.innerHTML = "<b>Succesfully added vehicle</b>";

            form.appendChild(success);
        }
    }

    async function addPerson(form) {
        var name = form.name.value;
        var address = form.address.value;
        var DOB = form.DOB.value;
        var licenseNumber = form.licenseNumber.value;
        var expiryDate = form.expiryDate.value;

        const urlParam = new URLSearchParams(window.location.search);

        var regPlate = urlParam.get("regPlate");
        var make = urlParam.get("make");
        var model = urlParam.get("model");
        var colour = urlParam.get("colour");
        var ownerID = urlParam.get("ownerID");

        const { error } = await supabase
            .from("People")
            .insert({ PersonID: ownerID, Name: name, Address: address, DOB: DOB, LicenseNumber: licenseNumber, ExpiryDate: expiryDate });

        if (error) {
            console.log("Error creating person");
            return;
        }

        const successMessage = document.createElement("p");
        successMessage.innerHTML = `<b>Successfully created person and vehicle</b>`
        form.appendChild(successMessage);

        const addVehicleButton = document.createElement("input")
        addVehicleButton.type = "button";
        addVehicleButton.name = "button";
        addVehicleButton.value = "Add another vehicle";
        addVehicleButton.id = "addVehicle";

        form.appendChild(addVehicleButton);

        const { error: erro2 } = await supabase
            .from("Vehicles")
            .insert({ VehicleID: regPlate, Make: make, Model: model, Colour: colour, OwnerID: ownerID })

        if (erro2) {
            console.log("Error adding vehicle");
            return;
        }

        document.getElementById("addVehicle").addEventListener("click", function () {
            switchPage(document.getElementById("driverForm"));
        });

    }

    function switchPage(form) {
        window.location.href = "add-vehicle.html";
    }

    if (document.title == "People Search") {
        document.querySelector("input[type='button']").addEventListener("click", function () {
            submitPeople(document.getElementById("driverForm"));
        });
    }
    else if (document.title == "Vehicle Search") {
        document.getElementById("vehicleSearch").addEventListener("click", function () {
            submitVehicle(document.getElementById("driverForm"));
        });
    }
    else if (document.title == "Add Vehicle") {
        document.getElementById("addVehicle").addEventListener("click", function () {
            addVehicle(document.getElementById("driverForm"));
        });
    }
    else if (document.title == "Add Person") {
        document.getElementById("addPerson").addEventListener("click", function () {
            addPerson(document.getElementById("personForm"));
        });
    }
});
