import { message } from "statuses";
import { Validate } from "./validateHelper";
import { measureMemory } from "vm";
import adopterRepository from "../../../backend/src/repositories/adopterRepository";
import staffRepository from "../../../backend/src/repositories/staffRepository";
import volunteerRepository from "../../../backend/src/repositories/volunteerRepository";

export class ValidateAccount{
    constructor(){
        this.adopter = document.getElementById(`login-adopter`);
        this.volunteer = document.getElementById('login-volunteer');
        this.staff = document.getElementById('login-staff')
    }

    validateAccount(payload){
        const message = new Validate();
        const volunteerEmail = new volunteerRepository();
        const adopterEmail = new adopterRepository();
        const staffEmail = new staffRepository();

       
        if(volunteerEmail.email !== this.adopter){
            message.showMessage(`The Account doesn't match on adopter form`, 'danger');
        }
        if(adopterEmail.email !== this.volunteer){
            message.showMessage(`The Account doesn't match on volunteer form`, 'danger');
        }
        if(staffEmail.email !== this.volunteer){
            message.showMessage(`The Account doesn't match on volunteer form`, 'danger')
        }
    }
}