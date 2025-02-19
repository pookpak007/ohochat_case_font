import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule ,FormBuilder,FormGroup} from '@angular/forms';
import { CallApiService } from './services/call-api.service';
import { Case } from './models/case';
import { CommonModule, DatePipe } from '@angular/common';
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver'
import { TagsComponent } from './components/tags/tags.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
    CommonModule, TagsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[DatePipe]
})
export class AppComponent {
  title = 'case';
  admin='ปั๊กคุง';
  case:Case[]=[];
  //ตัวแปร
  fg_date!:FormGroup;
  fg_url!:FormGroup;
  data:any[]=[];
  start_date:String="";
  end_date:String="";
  isloading:boolean=false;
  isShowCase = false;
  @ViewChild('appDiv') appDiv!:ElementRef;
  @ViewChild('btnrec') btnrec!:ElementRef;
  schoolname:{school_id:string,school_name:string}[]= [
    {
      school_id:"0",
      school_name:"โรงเรียนปากเกร็ด"
    },
    {
      school_id:"1",
      school_name:"โรงเรียนเทพศิรินทร์"
    },
    {
      school_id:"2",
      school_name:"โรงเรียนเทพศิรินทร์ร่มเกล้า"
    },
    {
      school_id:"3",
      school_name:"โรงเรียนเทพศิรินทร์ สมุทรปราการ"
    }
  ];
  constructor(
    private fb_url: FormBuilder,
    private fb_date: FormBuilder,
    private api:CallApiService,
    private datepipe:DatePipe
  ){}

  ngOnInit(): void {
    this.start_date = this.formatdatetime(new Date(),'00:00:00');
    this.end_date = this.formatdatetime(new Date(),'23:59:00');
    this.fg_url = this.fb_url.group({
      url:['https://api.oho.chat/latest/archived-case?$skip=0&$limit=8000&$populate[0][path]=assignee_member.member_id&$populate[0][select][]=display_name&$populate[0][select][]=role&$populate[0][select][]=image_url&$populate[1][path]=involved_members&$populate[1][populate][0]=member_id&$populate[2][path]=tags_migrate_objectid&$populate[3][path]=contact_id&$populate[3][select][]=_id&$populate[3][select][]=display_name&$populate[3][select][]=profile_picture_url&$sort[short_id]=-1&status[$in][]=done&closed_at[$gte]='+this.start_date+'%2B07:00&closed_at[$lte]='+this.end_date+'%2B07:00&channel_id[]=66a84cfbd9f220fd1866066a'],
      aut:['eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJzdWIiOiI2NmE4OTA3ZjA3YzkwNWU5MTZhNTYxMTIiLCJpYXQiOjE3MzUyMjM3MDEsImV4cCI6MTczNzgxNTcwMSwiYXVkIjoiaHR0cHM6Ly9vaG8uY2hhdCIsImlzcyI6ImZlYXRoZXJzIiwianRpIjoibWVtYmVyIn0.9FVcx_50xYwIfuEWPZwGZLMBhPHrXZi4GDa8fum9tc4'],
      admin:[this.admin]
    })

    this.fg_date = this.fb_date.group({
      date_start:[this.formatdatetime(new Date(),'00:00:00')],
      date_end:[this.formatdatetime(new Date(),'23:59:00')]
    });

  }

  exportExcel(data:Case[],filename:String):void{
    const workbook = new ExcelJS.Workbook();
    const Worksheet = workbook.addWorksheet('sheet1');
    Worksheet.mergeCells('A1:A4');//วันที่
    Worksheet.getCell('A1').value = 'วันที่'
    Worksheet.mergeCells('B1:B4');//ลำดับ
    Worksheet.getCell('B1').value = 'ลำดับ'
    Worksheet.mergeCells('C1:C4');//โรงเรียน
    Worksheet.getCell('C1').value = 'โรงเรียน'
    Worksheet.mergeCells('D1:D4');//ปัญหาที่ได้รับแจ้ง
    Worksheet.getCell('D1').value = 'ปัญหาที่ได้รับแจ้ง'
    Worksheet.mergeCells('E1:R1');//SOFTWARE
    Worksheet.getCell('E1').value = 'SOFTWARE'
    Worksheet.mergeCells('E2:K2');//Dstudent
    Worksheet.getCell('E2').value = 'Dstudent'
    Worksheet.mergeCells('L2:M2');//Dmanagement
    Worksheet.getCell('L2').value = 'Dmanagement'
    Worksheet.mergeCells('N2:Q2');//Dacademic
    Worksheet.getCell('N2').value = 'Dacademic'
    Worksheet.getCell('R2').value = 'Dservice'
    Worksheet.mergeCells('S1:S4');//โปรแกรมซิงค์
    Worksheet.getCell('S1').value = 'โปรแกรมซิงค์'
    Worksheet.mergeCells('E3:F3');//ระบบลงเวลา
    Worksheet.getCell('E3').value = 'ระบบลงเวลา'
    Worksheet.getCell('E4').value = 'Gateไม่ทำงาน'
    Worksheet.getCell('F4').value = 'โปรแกรม'
    Worksheet.mergeCells('G3:G4');//กิจการนักเรียน
    Worksheet.getCell('G3').value = 'กิจการนักเรียน'
    Worksheet.mergeCells('H3:H4');//ทะเบียนนักเรียน
    Worksheet.getCell('H3').value = 'ทะเบียนนักเรียน'
    Worksheet.mergeCells('I3:I4');//กิจกรรมโฮมรูม
    Worksheet.getCell('I3').value = 'กิจกรรมโฮมรูม'
    Worksheet.mergeCells('J3:J4');//เยี่ยมบ้าน
    Worksheet.getCell('J3').value = 'เยี่ยมบ้าน'
    Worksheet.mergeCells('K3:K4');//SDQ/EQ
    Worksheet.getCell('K3').value = 'SDQ/EQ'
    Worksheet.mergeCells('L3:L4');//บุตลากร
    Worksheet.getCell('L3').value = 'บุตลากร'
    Worksheet.mergeCells('M3:M4');//ประชาสัมพันธ์
    Worksheet.getCell('M3').value = 'ประชาสัมพันธ์'
    Worksheet.mergeCells('N3:N4');//Hybrid Classroom
    Worksheet.getCell('N3').value = 'Hybrid Classroom'
    Worksheet.mergeCells('O3:O4');//AI Classroom
    Worksheet.getCell('O3').value = 'AI Classroom'
    Worksheet.mergeCells('P3:P4');//Digital Resource Center
    Worksheet.getCell('P3').value = 'Digital Resource Center'
    Worksheet.mergeCells('Q3:Q4');//รับสมัคร นร.
    Worksheet.getCell('Q3').value = 'รับสมัคร นร.'
    Worksheet.mergeCells('R3:R4');//ห้องสมุดดิจิทัล
    Worksheet.getCell('R3').value = 'ห้องสมุดดิจิทัล'
    Worksheet.getCell('S1').value = 'โปรแกรมซิงค์'
    Worksheet.mergeCells('T1:V3');//internet
    Worksheet.getCell('T1').value = 'internet'
    Worksheet.getCell('T4').value = 'Gate'
    Worksheet.getCell('U4').value = 'บุคลากร'
    Worksheet.getCell('V4').value = 'ศูนย์อาหาร'
    Worksheet.mergeCells('W1:X3');//Network
    Worksheet.getCell('W1').value = 'Network'
    Worksheet.getCell('W4').value = 'สายlan'
    Worksheet.getCell('X4').value = 'Fiber'
    Worksheet.mergeCells('Y1:Z3');//เติมเงินผ่านธนาคาร
    Worksheet.getCell('Y1').value = 'เติมเงินผ่านธนาคาร'
    Worksheet.getCell('Y4').value = 'ธนาการไม่ส่งข้อมูล'
    Worksheet.getCell('Z4').value = 'internet (DDNS)'
    Worksheet.mergeCells('AA1:AB3');//นำเข้าข้อมูล/โอนข้อมูล
    Worksheet.getCell('AA1').value = 'นำเข้าข้อมูล/โอนข้อมูล'
    Worksheet.getCell('AA4').value = 'ข้อมูล'
    Worksheet.getCell('AB4').value = 'รูปภาพ'
    Worksheet.mergeCells('AC1:AC4');//เริมต้นระบบ
    Worksheet.getCell('AC1').value = 'เริมต้นระบบ'
    Worksheet.mergeCells('AD1:AD4');//บัตรเสีย/บัตรหาย/อัพเดทเลขมายแฟร์
    Worksheet.getCell('AD1').value = 'บัตรเสีย/บัตรหาย/อัพเดทเลขมายแฟร์'
    Worksheet.mergeCells('AE1:AF3');//เปิดปิดGate
    Worksheet.getCell('AE1').value = 'เปิดปิดGate'
    Worksheet.getCell('AE4').value = 'Remote แก้ไข'
    Worksheet.getCell('AF4').value = 'บริการ'
    Worksheet.mergeCells('AG1:AH3');//เปิดปิดระบบ
    Worksheet.getCell('AG1').value = 'เปิดปิดระบบ'
    Worksheet.getCell('AG4').value = 'Remote แก้ไข'
    Worksheet.getCell('AH4').value = 'บริการ'
    Worksheet.mergeCells('AI1:AL2');//USER
    Worksheet.getCell('AI1').value = 'USER'
    Worksheet.getCell('AI3').value = 'Dstudent'
    Worksheet.mergeCells('AJ3:AL3');//ศูนย์อาหาร
    Worksheet.getCell('AJ3').value = 'ศูนย์อาหาร'
    Worksheet.getCell('AI4').value = 'เพิ่ม/ลบ/แก้ไข ข้อมูล'
    Worksheet.getCell('AJ4').value = 'ร้านค้า'
    Worksheet.getCell('AK4').value = 'แคชเชียร์'
    Worksheet.getCell('AL4').value = 'นร./ผปค./ครู/ที่ปรึกษา'
    Worksheet.mergeCells('AM1:AM4');//รายงาน
    Worksheet.getCell('AM1').value = 'ศูนย์อาหาร'
    Worksheet.mergeCells('AN1:AN4');//แนะนำ
    Worksheet.getCell('AN1').value = 'แนะนำ'
    Worksheet.mergeCells('AO1:AO4');//App
    Worksheet.getCell('AO1').value = 'App'
    Worksheet.mergeCells('AP1:AP4');//ทำบัตรเพิ่ม
    Worksheet.getCell('AP1').value = 'ทำบัตรเพิ่ม'
    Worksheet.mergeCells('AQ1:BE2');//Hardware
    Worksheet.getCell('AQ1').value = 'Hardware'
    Worksheet.mergeCells('AQ3:AQ4');//Megvii
    Worksheet.getCell('AQ3').value = 'Megvii'
    Worksheet.mergeCells('AR3:AR4');//Hikvision
    Worksheet.getCell('AR3').value = 'Hikvision'
    Worksheet.mergeCells('AS3:AS4');//747
    Worksheet.getCell('AS3').value = '747'
    Worksheet.mergeCells('AT3:AT4');//IP Camara
    Worksheet.getCell('AT3').value = 'IP Camara'
    Worksheet.mergeCells('AU3:AU4');//RA/FR05/08
    Worksheet.getCell('AU3').value = 'RA/FR05/08'
    Worksheet.mergeCells('AV3:AV4');//PC,M/B Raspherry pi
    Worksheet.getCell('AV3').value = 'PC,M/B Raspherry pi'
    Worksheet.mergeCells('AW3:AW4');//UPS
    Worksheet.getCell('AW3').value = 'UPS'
    Worksheet.mergeCells('AX3:AX4');//Tv
    Worksheet.getCell('AX3').value = 'Tv'
    Worksheet.mergeCells('AY3:AY4');//Server
    Worksheet.getCell('AY3').value = 'Server'
    Worksheet.mergeCells('AZ3:AZ4');//Hub
    Worksheet.getCell('AZ3').value = 'Hub'
    Worksheet.mergeCells('BA3:BA4');//PIPO
    Worksheet.getCell('BA3').value = 'PIPO'
    Worksheet.mergeCells('BB3:BB4');//Customer display
    Worksheet.getCell('BB3').value = 'Customer display'
    Worksheet.mergeCells('BC3:BC4');//RFID
    Worksheet.getCell('BC3').value = 'RFID'
    Worksheet.mergeCells('BD3:BD4');//ตู้เติมเงิน
    Worksheet.getCell('BD3').value = 'ตู้เติมเงิน'
    Worksheet.mergeCells('BE3:BE4');//smartplug
    Worksheet.getCell('BE3').value = 'smartplug'
    Worksheet.mergeCells('BF1:BF4');//วิธีการแก้ไข
    Worksheet.getCell('BF1').value = 'วิธีการแก้ไข'
    Worksheet.mergeCells('BG1:BG4');//complete
    Worksheet.getCell('BG1').value = 'complete'
    Worksheet.mergeCells('BH1:BH4');//fallow
    Worksheet.getCell('BH1').value = 'fallow'
    Worksheet.mergeCells('BI1:BI4');//วิริยา
    Worksheet.getCell('BI1').value = 'วิริยา'
    Worksheet.mergeCells('BJ1:BJ4');//พลฤทธิ์
    Worksheet.getCell('BJ1').value = 'พลฤทธิ์'
    Worksheet.mergeCells('BK1:BK4');//รหัสเคส
    Worksheet.getCell('BK1').value = 'รหัสเคส'
    Worksheet.mergeCells('BL1:BL4');//school_undefine
    Worksheet.getCell('BL1').value = 'ไม่ได้ใส่ชื่อโรงเรียน'
    Worksheet.mergeCells('BM1:BM4');//user_indefine
    Worksheet.getCell('BM1').value = 'ไม่ได้ใส่ประเภท user'
    Worksheet.mergeCells('BN1:BN4');//howtofix_undefine
    Worksheet.getCell('BN1').value = 'ไม่ได้ใส่วิธีแก้ไข'
    Worksheet.mergeCells('BO1:BO4');//howtofix_undefine
    Worksheet.getCell('BO1').value = 'ไม่ได้ใส่แท็ก'
    Worksheet.mergeCells('BP1:BP4');
    Worksheet.getCell('BP1').value='Ticket';
    Worksheet.getColumn(64).width=17;
    Worksheet.getColumn(65).width=17;
    Worksheet.getColumn(66).width=17;
    Worksheet.getColumn(67).width=17;
    Worksheet.getColumn(68).width=17;
    const Software = ['E1','S1','E2','L2','N2','R2','E3','E4','F4','G3','H3','I3','J3','K3','L3','M3','N3','O3','P3','Q3','R3'];//Software
    Software.forEach((sof)=>{
      Worksheet.getCell(sof).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'00ffbb'},
      }
    });
    const internet = ['T1','T4','U4','V4'];//internet
    internet.forEach((net)=>{
      Worksheet.getCell(net).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'ffc879'},
      }
    });
    const network = ['W1','W4','X4'];//network
    network.forEach((net)=>{
      Worksheet.getCell(net).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'0be1ff'},
      }
    });
    const bank = ['W1','W4','X4'];//bank
    bank.forEach((b)=>{
      Worksheet.getCell(b).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'ff72d0'},
      }
    });
    const imp = ['AA1','AA4','AB4'];//import
    imp.forEach((im)=>{
      Worksheet.getCell(im).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'72ffdb'},
      }
    });
    const start = ['AC1'];//เริ่มต้นระบบ
    start.forEach((st)=>{
      Worksheet.getCell(st).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'72ffdb'},
      }
    });
    const card = ['AD1'];//บัตรเสีย/บัตรหาย/อัพเดทเลขมายแฟร์
    card.forEach((c)=>{
      Worksheet.getCell(c).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'ffc954'},
      }
    });
    const gate = ['AE1','AE4','AF4'];//เปิดปิดGate
    gate.forEach((g)=>{
      Worksheet.getCell(g).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'a9a9ff'},
      }
    });
    const system = ['AG1','AG4','AH4'];//เปิดปิดระบบ
    system.forEach((s)=>{
      Worksheet.getCell(s).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'ffc4dd'},
      }
    });
    const user = ['AI1','AI3','AJ3','AI4','AJ4','AK4','AL4'];//user
    system.forEach((s)=>{
      Worksheet.getCell(s).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'daff90'},
      }
    });
    const hardware = ['AQ1','AQ3','AR3','AS3','AT3','AU3','AV3','AW3','AX3','AY3','AZ3','BA3','BB3','BC3','BD3','BE3','BF3'];//Hardware
    hardware.forEach((h)=>{
      Worksheet.getCell(h).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'c4fbff'},
      }
    });

    /**Worksheet.addRow([
      'วันที่',
      'ลำดับ',
      'โรงเรียน',
      'ปัญหาที่ได้รับแจ้ง',
      'Gateไม่ทำงาน',
      'โปรแกรม',
      'กิจการนักเรียน',
      'ทะเบียนนักเรียน',
      'กิจกรรมโฮมรูม',
      'เยี่ยมบ้าน',
      'SDQ/EQ',
      'บุคลากร',
      'ประชาสัมพันธ์',
      'Hybrid Classroom',
      'AI Classroom',
      'Digital Resource Center',
      'รับสมัคร นร.',
      'ห้องสมุดดิจิทัล',
      'โปรแกรมซิ้งค์',
      'Gate',
      'บุคลากร',
      'ศูนย์อาหาร',
      'สายlan',
      'Fiber',
      'ธนาคารไม่ส่งข้อมูล',
      'Internet (DDNS)',
      'ข้อมูล',
      'รูปภาพ',
      'เริ่มต้นระบบ',
      'บัตรเสีย/บัตรหาย/อัพเดทเลขมายแฟร์',
      'Remote แก้ไข',
      'บริการ',
      'Remote แก้ไข',
      'บริการ',
      'เพิ่ม/ลบ/แก้ไข ข้อมูล',
      'ร้านค้า',
      'แคชเชียร์',
      'นร./ผปค./ครู/ที่ปรึกษา',
      'รายงาน',
      'แนะนำ',
      'APP',
      'ทำบัตรเพิ่ม',
      'Megvii',
      'HIK VISION',
      '747',
      'IP Camara',
      'RA/FR05/08',
      'PC,M/B Raspherry pi',
      'UPS',
      'TV',
      'Server',
      'HUB',
      'PIPO',
      'Customer Display',
      'RFID',
      'ตู้เติมเงิน',
      'Smartplug',
      'วิธีการแก้ไข',
      'complete',
      'follow',
      'วิริยา',
      'พลฤทธิ์',
      'รหัสเคส'
    ]);
    */
    
    data.forEach((item)=>{
      Worksheet.addRow([
        this.formatdateUS(new Date(item.date!)),
        '',
        item.school_name,
        item.problem_name,
        item.gate_notworking,
        item.time_program_system,
        item.attendance,
        item.infomation_student_register,
        item.homeroom,
        item.visit_home,
        item.sdq_eq,
        item.person,
        item.public_relations,
        item.hybrid_classroom,
        item.ai_classroom,
        item.digital_resource_center,
        item.recruiting,
        item.libraly_digital,
        item.synce,
        item.internet_gate,
        item.internet_person,
        item.internet_person,
        item.network_lan,
        item.network_fiber,
        item.bank_notsend,
        item.DDNS,
        item.import_data,
        item.picture,
        item.start_system,
        item.card_damaged,
        item.remote_edit,
        item.services,
        item.openSystem_remote_edit,
        item.openSystem_services,
        item.crud,
        item.shop,
        item.cashier,
        item.user,
        item.report,
        item.recommend,
        item.app,
        item.make_card,
        item.megvii,
        item.hikvision,
        item.gate747,
        item.ip_camera,
        item.ra_fr,
        item.pc_MB_Raspherrypi,
        item.ups,
        item.tv,
        item.server,
        item.hub,
        item.pipo,
        item.customer_display,
        item.rfid,
        item.top_up_cupboard,
        item.smart_plug,
        item.howtofix,
        item.complete,
        item.follow,
        item.wiriya,
        item.pookpak,
        item.short_id,
        item.school_undefine,
        item.user_undefine,
        item.howtofix_undefine,
        item.tag_undefine
      ]);
    });
    const lastrow = Worksheet.lastRow;
    if(Worksheet.lastRow?.number){
      for(let r=1;r<=Worksheet.lastRow.number;r++){
        for(let c=1;c<=68;c++){
          Worksheet.getCell(r,c).alignment = {horizontal:'center',vertical:'middle'};
          let school_name = Worksheet.getCell(r,64).value;
          let type_user = Worksheet.getCell(r,65).value;
          let howtofix = Worksheet.getCell(r,66).value;
          let tags = Worksheet.getCell(r,67).value;
          if(school_name=="1" || type_user=="1" || howtofix=="1" || tags=="1"){
            Worksheet.getCell(r,63).fill = {
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FFFF0000'},
              bgColor:{argb:'FFFF0000'}
            };
          }
          Worksheet.getCell(r,c).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
        }
      }
    }
    
    Worksheet.columns.forEach((col)=>{
      let max=5;
      if(col.eachCell){
        col.eachCell({includeEmpty:true},(cell)=>{
          if(cell.value){
            const cellvalues = cell.value.toString();
            if(cellvalues.length > max){
              max=cellvalues.length
            }
          }
        })
        col.width= max+2;
      }  
    })

    workbook.xlsx.writeBuffer().then((buffer)=>{
      const blob = new Blob([buffer],{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      saveAs(blob,filename+'.xlsx');
    });
  }

  formatdateUS(date:Date):String{
    let year = date.getFullYear();
    let month = String(date.getMonth()+1).padStart(2,'0');
    let day = String(date.getDate()).padStart(2,'0');
    return year+'-'+month+'-'+day
  }

  startDateChange(){
    this.start_date = String(this.datepipe.transform(this.fg_date.value.date_start,'yyyy-MM-ddTHH:mm:ss'))
    this.end_date = String(this.datepipe.transform(this.fg_date.value.date_end,'yyyy-MM-ddTHH:mm:ss'))
    this.fg_url.patchValue({
      url:'https://api.oho.chat/latest/case?$skip=0&$limit=8000&$populate[0][path]=assignee_member.member_id&$populate[0][select][]=display_name&$populate[0][select][]=role&$populate[0][select][]=image_url&$populate[1][path]=involved_members&$populate[1][populate][0]=member_id&$populate[2][path]=tags_migrate_objectid&$populate[3][path]=contact_id&$populate[3][select][]=_id&$populate[3][select][]=display_name&$populate[3][select][]=profile_picture_url&$sort[short_id]=-1&closed_at[$gte]='+this.start_date+'%2B07:00&closed_at[$lte]='+this.end_date+'%2B07:00&channel_id[]=66a84cfbd9f220fd1866066a'
    });
  }

  formatdatetime(date:Date,time:String):String{
    const timeoffzet = date.getTimezoneOffset();
    let timzone = 0;
    if(timeoffzet <=420){
      timzone = (timeoffzet*-1)/60
    }else if(timeoffzet>=420){
      timzone = (timeoffzet*-1)/60
    }else if(timeoffzet ==0){

    }
    
    const year = String(date.getFullYear())
    const month = String(date.getMonth()+1).padStart(2,'0')
    const day = String(date.getDate()).padStart(2,'0') 
    const hours = String(date.getHours()).padStart(2,'0');
    const min = String(date.getMinutes()).padStart(2,'0');
    const datetime =new Date(); 
    return `${year}-${month}-${day}T${time}`;
  }

  loadData(){
    this.isloading=true;
    this.data = [];
    this.case=[];
    this.api.getCase(this.fg_url.value.url,this.fg_url.value.aut).subscribe(
      res =>{
        this.data = res.data
        for(let i=0;i<this.data.length;i++){  
          if(this.data[i].assignee_member?.member_id?.display_name ==this.admin){
            let case2:Case=new Case();
            //tag1
            let checkcase:boolean=false;
            if(this.data[i].tags_migrate_objectid.length !=0){
            for(let oo =0;oo<this.data[i].tags_migrate_objectid.length;oo++){
              switch(this.data[i].tags_migrate_objectid[oo].keyword){
                case'User:DStudent:เพิ่ม/ลบ/แก้ไข ข้อมูล':
                  case2.crud="1"   
                  if(checkcase){
                    case2.tag_undefine=""
                  }            
                  break;
                case'App':
                  case2.app="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'User:ศูนย์อาหาร:ร้านค้า':
                  case2.cashier="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dstudent:เยี่ยมบ้าน':
                  case2.visit_home="1"    
                  if(checkcase){
                    case2.tag_undefine=""
                  }        
                  break;
                case'Software:Dstudent:SDQ/EQ':
                  case2.sdq_eq="1" 
                  if(checkcase){
                    case2.tag_undefine=""
                  }              
                  break;
                case'Software:Dmanagement:บุคลากร':
                  case2.person="1"    
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dmanagement:ประชาสัมพันธ์':
                  case2.public_relations="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dacademic:Hybrid Classroom':
                  case2.hybrid_classroom="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dacademic:AI Classroom':
                  case2.ai_classroom="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dacademic:Digital Resource Center':
                  case2.digital_resource_center="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dacademic:รับสมัคร นร.':
                  case2.recruiting="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dservice:ห้องสมุดดิจิทัล':
                  case2.libraly_digital="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'โปรแกรมซิ้งค์':
                  case2.synce="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Internet:Gate':
                  case2.internet_gate="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Internet:บุคลากร':
                  case2.internet_person="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Internet:ศูนย์อาหาร':
                  case2.internet_food="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Network:สายlan':
                  case2.network_lan="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Network:Fiber':
                  case2.network_fiber="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'เติมเงินผ่านธนาคาร:ธนาคารไม่ส่งข้อมูล':
                  case2.bank_notsend="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'เติมเงินผ่านธนาคาร:Internet (DDNS)':
                  case2.DDNS="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;      
                case'นำเข้าข้อมูล/โอนข้อมูล':
                  case2.import_data="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Cloud':
                  case2.cloud="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;    
                case'รูปภาพ':
                  case2.picture="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'เริ่มต้นระบบ':
                  case2.start_system="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'บัตรเสีย/บัตรหาย/อัพเดทเลขมายแฟร์':
                  case2.card_damaged="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'เปิดปิดGate:Remote แก้ไข':
                  case2.remote_edit="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;    
                case'เปิดปิดGate:บริการ':
                  case2.services="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'เปิดปิดระบบ:Remote แก้ไข':
                  case2.openSystem_remote_edit="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'เปิดปิดระบบ:บริการ':
                  case2.openSystem_services="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'รายงาน':
                  case2.report="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'แนะนำ':
                  case2.recommend="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'ทำบัตรเพิ่ม':
                  case2.make_card="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:Megvii':
                  case2.megvii="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:Hikvision':
                  case2.hikvision="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;   
                case'Hardware:747':
                  case2.gate747="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:IP Camara':
                  case2.ip_camera="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:RA/FR05/08':
                  case2.ra_fr="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:PC,M/B Raspherry pi':
                  case2.pc_MB_Raspherrypi="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:UPS':
                  case2.ups="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:TV':
                  case2.tv="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:Server':
                  case2.server="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break; 
                case'Hardware:HUB':
                  case2.hub="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Hardware:PIPO':
                  case2.pipo="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Hardware:Customer Display':
                  case2.customer_display="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Hardware:RFID':
                  case2.rfid="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Hardware:ตู้เติมเงิน':
                  case2.top_up_cupboard="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Hardware:SmartPlug':
                  case2.smart_plug="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'User:ศูนย์อาหาร:แคชเชียร์':
                  case2.cashier="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'กิจการนักเรียน':
                  case2.attendance ="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'ทักทาย':
                  case2.greet="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Gateไม่ทำงาน':
                  case2.gate_notworking="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'กิจกรรมโฮมรูม':
                  case2.homeroom="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'ทะเบียนนักเรียน':
                  case2.infomation_student_register="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'นร./ผปค./ครู/ที่ปรึกษา':
                  case2.user="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'Software:Dstudent:ระบบลงเวลา:โปรแกรม':
                  case2.time_program_system="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                case'ไม่ทราบ':
                  case2.tag_undefine="1"
                  if(checkcase){
                    case2.tag_undefine=""
                  }  
                  break;
                default:
                  case2.tag_undefine="1";
                  checkcase=true;
                  break;
            }
          }
        }else{
          case2.tag_undefine="1";
        }

          
         
          if(this.data[i].description?.includes(',')){
            const des:string[] = this.data[i].description?.split(',');
            case2.school_name = des[0];
            case2.howtofix = des[2]            
          }

          if(this.data[i].description != undefined){
            if(this.countCharacter(this.data[i].description,',') <=1){
              case2.school_undefine="1";
              case2.howtofix_undefine="1"
              case2.user_undefine="1"
            }
          }else if(this.data[i].description == undefined){
            case2.school_undefine="1";
            case2.howtofix_undefine="1"
            case2.user_undefine="1"
          }
          console.log(this.data[i].description);

          case2.short_id=this.data[i].short_id;
          case2.problem_name = this.data[i].name;
          case2.date = this.data[i].closed_at;
          switch(this.admin){
            case'ปั๊กคุง':
              case2.pookpak="1"
              break;
            case'Kae':
            case2.wiriya="1"
              break;
            case'Komin':
              case2.komin="1"
              break;
            default:
                break;
          }
          this.case.push(case2);
          }
          
        }
        this.isloading=false;
        this.exportExcel(this.case,'helpdesk '+this.admin);
      }
    );
  }

  countCharacter(text:string,charToCount:string):number{
    if(text == undefined){
      return 0
    }
    console.log('test'+text);
    return (text?.split(charToCount).length-1);
  }

  selectChange(){
    this.admin = this.fg_url.value.admin
  }

  showCase(){
    this.isShowCase = !this.isShowCase
  }

  onValueChange(newValue:boolean){
    this.isShowCase = newValue
    console.log('test');
  }

  /* @HostListener('click',['$event'])
 onClick(event:MouseEvent){
    const target = this.appDiv.nativeElement?.contains(event.target)
    const btn = this.btnrec.nativeElement.contains(event.target)
    
    if(btn){
      this.showCase();
    }else{
      if(target){
        this.isShowCase = false;
      }
    }
    
  }*/
}
