import { Component } from '@angular/core';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {AlertController,ToastController} from '@ionic/angular'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listToggle:boolean=false;
  listaPairedDevices:PairedList;
  listaUnPairedDevices:PairedList;
  pairedDeviceId:number=0;
  
  //BLUETOOTHSERIAL VEDE DISPOSITIVI GIA' BOUNDED!!!!!

  constructor(private bluetoothserial:BluetoothSerial, private alertCtrl:AlertController, private toastController:ToastController) {

    this.checkBluetoothEnabled();
  }

  checkBluetoothEnabled(){

    this.bluetoothserial.isEnabled().then(success=>{

      this.listPairedDevices();
      this.listUnpairedDevices();


    }, error=>{

      this.showError("BLUETOOTH NON ABILITATO");
      this.listToggle=false;
    })
  }

  listPairedDevices(){
    console.log("inizio scansione")
    this.bluetoothserial.list().then(lista=>{
    
      this.listaPairedDevices=lista;
      this.listToggle=true;

    }, errore=>{
      console.log("errore")
      this.showError("BLUETOOTH NON ABILITATO");
      this.listToggle=false;
    })

    

  }
  listUnpairedDevices(){
    console.log("inizio scansione unpaired")
    this.bluetoothserial.discoverUnpaired().then(lista=>{
    
      this.listaUnPairedDevices=lista;
      this.listToggle=true;

    }, errore=>{
      console.log("errore")
      this.showError("BLUETOOTH NON ABILITATO");
      this.listToggle=false;
    })
  }

  selectDevice(connectedDevice){
    //this.pairedDeviceId=pairedDeviceId;
    //let connectedDevice=this.listaPairedDevices[this.pairedDeviceId]
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

  sendCommand(command){

    command+='\n';
    this.showToast(command);
    this.bluetoothserial.write(command).then(success=>{
      this.showToast(success);
    }, error=>{
      this.showError(error);
    })
  }

  async showToast(message){
    const toast = await this.toastController.create({

      message:message,
      duration:1000 
    });
    
    toast.present();

  }

  async showError(error){
    const alert= await this.alertCtrl.create({
      
      message:error,
      
      buttons: ['dismiss']
    });
    await alert.present();

  }

}

interface PairedList{

  "class": number,
  "id": string,
  "address": string,
  "name": string
}
