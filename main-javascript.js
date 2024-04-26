import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseUrl = 'https://bgieveocrzkpazulvhch.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWV2ZW9jcnprcGF6dWx2aGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwNjI0NDcsImV4cCI6MjAyNzYzODQ0N30.mxVAfUdKKa3P_Xut9YmIyXOoa0_wQ_orG437hdPqsQo";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
    async function submitPeople(form) {
        var name = form.name.value;
        var license = form.license.value;
        let error = null;
        let data = null;

        const dottedSpace = document.querySelector(".dottedSpace");
        dottedSpace.style.padding = "10px";

        const table = document.getElementById("results")
        table.innerHTML = "";

        if (name && license) {
            const message = document.getElementById("message");
            message.style.visibility = "visible";
            message.innerHTML = "<b>Error</b>"
            console.log("Error: Cannot search by both driver's name and license");
            return;
        }
        else if (name && !license) {
            const { data: data1, error: error1 } = await supabase
                .from("People")
                .select("*")
                .or(`Name.ilike.*${name} %*, Name.ilike.*% ${name}, Name.ilike.${name}`);

            data = data1;
            error = error1;
        }
        else if (license && !name) {
            const { data: data1, error: error1 } = await supabase
                .from("People")
                .select("*")
                .eq("LicenseNumber", license);
            data = data1;
            error = error1;
        }
        else {
            const message = document.getElementById("message");
            message.style.visibility = "visible";
            message.innerHTML = "<b>Error</b>"
            return;
        }

        const message = document.getElementById("message");
        message.innerHTML = "";

        if (error) {
            console.error("Error fetching driver:", error);
            message.style.visibility = "visible";
            message.innerHTML = `<b>Error</b>`
            return;
        }
        else if (data.length == 0) {
            console.log("Driver not found");
            message.style.visibility = "visible";
            message.innerHTML = "<b>No result found</b>";
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
        message.style.visibility = "visible";
        message.innerHTML = "<b>Search successful</b>";
    }

    async function submitVehicle(form) {
        var rego = form.rego.value;

        const dottedSpace = document.querySelector(".dottedSpace");
        dottedSpace.style.padding = "10px";

        const table = document.getElementById("results")
        table.innerHTML = "";

        const message = document.getElementById("message");
        message.innerHTML = "";


        if (!rego) {
            console.error("No plate entered");
            message.style.visibility = "visible";
            message.innerHTML = "<b>Error</b>"
            return;
        }
        const { data, error } = await supabase
            .from("Vehicles")
            .select("VehicleID, Make, Model, Colour, People(Name, LicenseNumber)")
            .ilike("VehicleID", `%${rego}%`);

        if (error) {
            console.error("Error fetching vehicle:", error);
            message.style.visibility = "visible";
            message.innerHTML = "<b>Error</b>";
            return;
        }
        else if (data.length == 0) {
            console.log("Vehicle not found");
            message.style.visibility = "visible";
            message.innerHTML = "<b>No result found</b>";
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
            const div = document.createElement("div");
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
            record.appendChild(div);
            table.appendChild(record);
        }
        message.style.visibility = "visible";
        message.innerHTML = "<b>Search successful</b>";
    }

    async function addVehicle(form) {
        var rego = form.rego.value;
        var make = form.make.value;
        var model = form.model.value;
        var colour = form.colour.value;
        var owner = form.owner.value;

        const errorMessage = document.getElementById("message");
        errorMessage.innerHTML = "";

        if (!rego || !make || !model || !colour || !owner) {
            errorMessage.style.visibility = "visible";
            errorMessage.innerHTML = "<b>Error</b>"
            form.appendChild(errorMessage);
            return;
        }

        const { data, error1 } = await supabase
            .from("People")
            .select("PersonID")
            .ilike("Name", owner);

        if (error1) {
            console.log("Error creating vehicle");
            errorMessage.style.visibility = "visible";
            errorMessage.innerHTML = "<b>Error</b>";
            return;
        }
        // create new person
        else if (data.length == 0) {
            form.action = "add-person.html";
            form.method = "GET";
            form.addVehicle.type = "submit"
            form.submit();
            //return;
        }
        else {
            const { data: data2, error: error2 } = await supabase
                .from("People")
                .select("PersonID")
                .ilike("Name", owner);

            const { error } = await supabase
                .from("Vehicles")
                .insert({ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: data2[0].PersonID })

            if (error) {
                console.log("Error adding vehicle");
                const errorMessage = document.getElementById("message");
                errorMessage.style.visibility = "visible";
                errorMessage.innerHTML = "<b>Error</b>";
                return;
            }

            const success = document.getElementById("message");
            success.style.visibility = "visible";
            success.innerHTML = "<b>Vehicle added successfully</b>";

            form.appendChild(success);
        }




    }

    async function addPerson(form) {
        var personid = form.personid.value;
        var name = form.name.value;
        var address = form.address.value;
        var dob = form.dob.value;
        var license = form.license.value;
        var expire = form.expire.value;

        const urlParam = new URLSearchParams(window.location.search);

        var rego = urlParam.get("rego");
        var make = urlParam.get("make");
        var model = urlParam.get("model");
        var colour = urlParam.get("colour");
        var owner = urlParam.get("owner");

        if (!personid || !name || !address || !dob || !license || !expire) {
            const errorMessage = document.createElement("p");
            errorMessage.id = "message";
            errorMessage.innerHTML = "<b>Error</b>"
            form.appendChild(errorMessage);
            return;
        }

        const { error } = await supabase
            .from("People")
            .insert({ PersonID: personid, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire });

        if (error) {
            console.log("Error creating person");
            const successMessage = document.createElement("p");
            successMessage.id = "message";
            successMessage.innerHTML = `<b>Error</b>`
            form.appendChild(successMessage);
            return;
        }



        const addVehicleButton = document.createElement("input")
        addVehicleButton.type = "button";
        addVehicleButton.name = "button";
        addVehicleButton.value = "Add another vehicle";
        addVehicleButton.id = "addVehicle";

        form.appendChild(addVehicleButton);

        const { error: error2 } = await supabase
            .from("Vehicles")
            .insert({ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: personid })

        if (error2) {
            const successMessage = document.createElement("p");
            successMessage.id = "message";
            successMessage.innerHTML = `<b>Error</b>`
            form.appendChild(successMessage);
            console.log("Error adding vehicle");
            return;
        }

        const successMessage = document.createElement("p");
        successMessage.id = "message";
        successMessage.innerHTML = `<b>Vehicle added successfully</b>`
        form.appendChild(successMessage);

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
