const actions_grid = document.querySelector(".actions_grid");
const date_input = document.querySelector(".input_date");
const select = document.querySelector(".select");

class Workouts{
    constructor(name, id, date){
        this.name = name;
        this.id = id;
        this.date = date;
    }

    GetImgPath(){
        return `./img/muscles/${this.name.replace(" ", "_")}.png`;
    }

    GetName(){
        return this.capitalizeFirstLetter(this.name)
    }

    capitalizeFirstLetter(text) {
        const words = text.split(" ");
        const capitalizedWords = words.map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        const result = capitalizedWords.join(" ");
        return result;
      }

    calculateDaysPassed() {
        const date1 = new Date(this.date);
        const date2 = new Date(this. GetDate());
        const Difference_In_Time = date2.getTime() - date1.getTime();
        const Difference_In_Days =  Difference_In_Time / (1000 * 3600 * 24);
        return isNaN(Difference_In_Days) ? "No data available" : `${Math.round(Difference_In_Days)} day${Difference_In_Days != 1 ? "s":""} ago`;
    }

    PassedDays(){
        const date1 = new Date(this.date);
        const date2 = new Date(this. GetDate());
        const Difference_In_Time = date2.getTime() - date1.getTime();
        const Difference_In_Days =  Difference_In_Time / (1000 * 3600 * 24);
        return isNaN(Difference_In_Days) ? 999 : Math.round(Difference_In_Days);
    }

    GetDate(){
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; 
        let year = currentDate.getFullYear();
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }

    GetHtml(){
        const divElement = document.createElement("div");
        divElement.className = "action";
        divElement.onclick = () => SetDate(this.id);;
        
        const workoutDiv = document.createElement("div");
        workoutDiv.className = "workout";
        
        const imgElement = document.createElement("img");
        imgElement.src = this.GetImgPath();
        
        const h1Element = document.createElement("h1");
        h1Element.textContent = this.GetName();
        
        workoutDiv.appendChild(imgElement);
        workoutDiv.appendChild(h1Element);
        
        const dateDiv = document.createElement("div");
        dateDiv.className = "date";
        
        const pElement1 = document.createElement("p");
        pElement1.textContent = this.date == undefined ? "No data available" : this.date;
        
        const pElement2 = document.createElement("p");
        pElement2.textContent = this.calculateDaysPassed();
        
        dateDiv.appendChild(pElement1);
        dateDiv.appendChild(pElement2);
        
        divElement.appendChild(workoutDiv);
        divElement.appendChild(dateDiv);
        return divElement;
    }

    SetDate(){
        this.date = this.GetDate();
    }
}

let workouts = [];

function BuildActionsButtons()
{
    const tmp = workouts;
    const sortedArray = tmp.sort((a, b) => b.PassedDays() - a.PassedDays());

    actions_grid.innerHTML = "";
    sortedArray.forEach(element => {
        actions_grid.appendChild(element.GetHtml());
    });
}

function SetDate(id){
    workouts.find(n => n.id === id).SetDate();
    SaveData();
    BuildActionsButtons();
    AdjustDateInit();   
}

function GetData(){
    let data = localStorage.getItem("pdf_workouts")
    if(data == null){
        workouts = [ new Workouts("bicep",0), new Workouts("tricep",1), new Workouts("antebrazo",2), new Workouts("hombro",3), new Workouts("pecho",4), new Workouts("espalda",5), new Workouts("core",6), new Workouts("tren inferior",7)];
    }else{
        workouts = [];
        data = JSON.parse(data);
        data.forEach(element => {
            workouts.push(new Workouts(element.name, element.id, element.date))
        });
    }

    BuildActionsButtons();
}

function AdjustDateInit(){
    select.innerHTML = "";
    workouts.forEach(function(opcion) {
        option = document.createElement('option');
        option.value = opcion.id;
        option.text = opcion.GetName();
        select.appendChild(option);
    });
}

function UpdateDate(){
    var val = select.value;
    var parts = date_input.value.split('-');
    var transformedDate = parts[0] + '/' + parts[1] + '/' +  parts[2]
    workouts.find(n => n.id == select.value).date = transformedDate;
    SaveData();
    BuildActionsButtons();
    AdjustDateInit();
    select.value = val;
}

function SaveData(){
    localStorage.setItem("pdf_workouts", JSON.stringify(workouts))
}

GetData();
AdjustDateInit();
