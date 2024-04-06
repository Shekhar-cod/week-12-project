
/*This "House" class represents individual houses and has a construter method that initalizes a house with a name */

class House {
    constructor(name) {
        this.name = name;
       
    }

    
}

/* This class provides static methods to interact with a remote 
API for CRUD operations(Create, Read, Update, Delete) on houses */
class HouseService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

    static getAllHouses() {
        return $.get(this.url);
    }

    static getHouse(id) {
     return $.get(this.url + `/${id}`);
    }

    static createHouse(house) {
        return $.post(this.url, house);
    }

    static updateHouse(house) {
        return $.ajax({
           url: this.url + `/${house._id}`,
           dataType: 'json',
           data: JSON.stringify(house),
           contentType: 'application/json',
           type: 'PUT' 
        });
    }
    
    static deleteHouse(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}


/* DoMManager class manages the rendering of houses in the DOM 
and handles user interactions.*/
class DOMManager {
    static houses;

/* This method getAllHouses() retrieve and render all houses*/
    static getAllHouses() {
        HouseService.getAllHouses().then(houses => this.render(houses));
    }
/* This method create a new house and update the DOM.*/
    static createHouse(name) {
        HouseService.createHouse(new House(name))
         .then(() =>{
            return HouseService.getAllHouses();
         })
         .then((houses) => this.render(houses));
    }
/* This method delete a house and update the DOM*/
    static deleteHouse(id) {
        HouseService.deleteHouse(id)
         .then(() => {
            return HouseService.getAllHouses();
         })
         .then((houses) => this.render(this.houses));
    }

    

    
/* This method dynamically generates HTML elements to dispaly each house, 
   including its name and a delete button*/
    static render(houses) {
        this.houses = houses;
        $('#app').empty();
        for (let house of houses) {
          $('#app').prepend(
            `<div id="${house._id}" class="card">
            <div class="card-header">
            <h2>${house.name}</h2>
            <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
            </div>
         </div> <br>`
          );
        }
    }
}

$('#create-new-house').click(() =>{
    DOMManager.createHouse($('#new-house-name').val())
    $('#new-house-name').val('');
});


/* This DOMManager.getAllHouses() will fetches all houses from 
the API and render them in the DOM*/

DOMManager.getAllHouses();