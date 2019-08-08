import { Component } from '@angular/core';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {AlertController,ToastController} from '@ionic/angular'
import { timingSafeEqual } from 'crypto';
import { testUserAgent } from '@ionic/core/dist/types/utils/platform';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listToggle:boolean=false;
  listaPairedDevices:PairedList;
  pairedDeviceId:number=0;
  command:string="";

  constructor(private bluetoothserial:BluetoothSerial, private alertCtrl:AlertController, private toastController:ToastController) {

    this.checkBluetoothEnabled();
  }

  checkBluetoothEnabled(){

    this.bluetoothserial.isEnabled().then(success=>{

      this.listPairedDevices();


    }, error=>{

      this.showError("BLUETOOTH NON ABILITATO");
      this.listToggle=false;
    })
  }

  listPairedDevices(){

    this.bluetoothserial.list().then(lista=>{
    
      this.listaPairedDevices=lista;
      this.listToggle=true;

    }, errore=>{
      this.showError("BLUETOOTH NON ABILITATO");
      this.listToggle=false;
    })

    

  }

  selectDevice(){
  
    let connectedDevice=this.listaPairedDevices[this.pairedDeviceId]
    if(!connectedDevice.address){
      this.showError("devi scegliere un device!");
      return;
    }

    let address=connectedDevice.address;
    let name = connectedDevice.name;
    
    this.connect(address);
  }

  connect(address){

    this.bluetoothserial.connect(address).subscribe(success=>{
      this.deviceConnected();
      this.showToast("connessione riuscita!");

    }, error=>{
      this.showError("Errore di connessione!");
    })
  }
  
  deviceConnected(){

    this.bluetoothserial.subscribe('\n').subscribe(success=>{
      
    }, errore=>{

    })

  }

  sendCommand(){

    this.command+='\n';
    this.showToast(this.command);
    this.bluetoothserial.write(this.command).then(success=>{
      this.showToast(success);
    }, error=>{
      this.showError(error);
    })
  }
  showToast(messagge){


  }

  showError(error){


  }

}

interface PairedList{

  "class": number,
  "id": string,
  "address": string,
  "name": string
}
