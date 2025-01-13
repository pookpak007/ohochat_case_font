import { Component, ElementRef, HostListener, ViewChild ,Input, SimpleChanges,ChangeDetectorRef, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {
  //ตัวแปร
  isShow:boolean=false;
  isShowTags:boolean=false;
  isShowCas:boolean=false;
  @ViewChild('targetdiv') targetdiv!:ElementRef;
  @ViewChild('casconDiv') targetCas!:ElementRef;
  @ViewChild('casconDiv') casconDiv!:ElementRef
  @Input() isShowCaseee!:boolean
  @Output() isShowCaseeeChanged:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private cdr:ChangeDetectorRef
  ){}
ngOnInit(): void {
  this.isShowCas = this.isShowCaseee
}

ngOnChanges(changes:SimpleChanges){
  if(changes['isShowCaseee']){
    this.isShowCas = this.isShowCaseee
  }

}

toggleShowCase(){
  this.isShowCas = !this.isShowCas
  this.cdr.detectChanges();
}

  tagsname:{id:number,tag_name:string}[]=[
    {id:0,tag_name:"User:DStudent:เพิ่ม/ลบ/แก้ไข ข้อมูล"},
    {id:1,tag_name:"App"},
    {id:2,tag_name:"User:ศูนย์อาหาร:ร้านค้า"},
    {id:3,tag_name:"Software:Dstudent:เยี่ยมบ้าน"},
    {id:4,tag_name:"Software:Dstudent:SDQ/EQ"},
    {id:5,tag_name:"Software:Dmanagement:บุคลากร"},
    {id:6,tag_name:"Software:Dmanagement:ประชาสัมพันธ์"},
    {id:7,tag_name:"Software:Dacademic:Hybrid Classroom"},
    {id:8,tag_name:"Software:Dacademic:AI Classroom"},
    {id:9,tag_name:"Software:Dacademic:Digital Resource Center"},
    {id:10,tag_name:"Software:Dacademic:รับสมัคร นร."},
    {id:11,tag_name:"Software:Dservice:ห้องสมุดดิจิทัล"},
    {id:12,tag_name:"โปรแกรมซิ้งค์"},
    {id:13,tag_name:"Internet:Gate"},
    {id:14,tag_name:"Internet:บุคลากร"},
    {id:15,tag_name:"Internet:ศูนย์อาหาร"},
    {id:16,tag_name:"Network:สายlan"},
    {id:17,tag_name:"Network:Fiber"},
    {id:18,tag_name:"เติมเงินผ่านธนาคาร:ธนาคารไม่ส่งข้อมูล"},
    {id:19,tag_name:"เติมเงินผ่านธนาคาร:Internet (DDNS)"},
    {id:20,tag_name:"นำเข้าข้อมูล/โอนข้อมูล"},
    {id:21,tag_name:"Cloud"},
    {id:22,tag_name:"รูปภาพ"},
    {id:23,tag_name:"เริ่มต้นระบบ"},
    {id:24,tag_name:"บัตรเสีย/บัตรหาย/อัพเดทเลขมายแฟร์"},
    {id:25,tag_name:"เปิดปิดGate:Remote แก้ไข"},
    {id:26,tag_name:"เปิดปิดGate:บริการ"},
    {id:27,tag_name:"เปิดปิดระบบ:Remote แก้ไข"},
    {id:28,tag_name:"เปิดปิดระบบ:บริการ"},
    {id:29,tag_name:"รายงาน"},
    {id:30,tag_name:"แนะนำ"},
    {id:31,tag_name:"ทำบัตรเพิ่ม"},
    {id:32,tag_name:"Hardware:Megvii"},
    {id:33,tag_name:"Hardware:Hikvision"},
    {id:34,tag_name:"Hardware:747"},
    {id:35,tag_name:"Hardware:IP Camara"},
    {id:36,tag_name:"Hardware:RA/FR05/08"},
    {id:37,tag_name:"Hardware:PC,M/B Raspherry pi"},
    {id:38,tag_name:"Hardware:UPS"},
    {id:39,tag_name:"Hardware:TV"},
    {id:40,tag_name:"Hardware:Server"},
    {id:41,tag_name:"Hardware:HUB"},
    {id:42,tag_name:"Hardware:PIPO"},
    {id:43,tag_name:"Hardware:Customer Display"},
    {id:44,tag_name:"Hardware:RFID"},
    {id:45,tag_name:"Hardware:ตู้เติมเงิน"},
    {id:46,tag_name:"Hardware:SmartPlug"},
    {id:47,tag_name:"กิจการนักเรียน"},
    {id:48,tag_name:"ทักทาย"},
    {id:49,tag_name:"Gateไม่ทำงาน"},
    {id:50,tag_name:"กิจกรรมโฮมรูม"},
    {id:51,tag_name:"ทะเบียนนักเรียน"},
    {id:52,tag_name:"นร./ผปค./ครู/ที่ปรึกษา"},
    {id:53,tag_name:"Software:Dstudent:ระบบลงเวลา:โปรแกรม"},
    {id:54,tag_name:"ไม่ทราบ"} 
  ]
  tagslist:{id:number,tag_name:string}[]=[];
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

  tags_click(){
    console.log('test');
    this.isShow = !this.isShow
  }

  deletetag(id:number,index:number){
    console.log(id);
    this.tagslist.splice(index,1);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const popup = this.targetdiv?.nativeElement.contains(event.target);
    const cas = this.targetCas?.nativeElement.contains(event.target)
    const cascon =this.casconDiv?.nativeElement.contains(event.target)
    if (!popup) {
      this.isShow = false;
    }
    if(cas){
      this.isShowCas=false
    }
    if(!cascon){
      this.isShowCas=false
    }

  }
  isDisable(){
    this.isShowCaseee = false
    this.isShowCaseeeChanged.emit(this.isShowCaseee);
    console.log('testtt');
  }

  onDoubleClick(index:Number){
    this.isShow = false
    const item = {
      id:0,
      tag_name:''
    }
    item.id = this.tagsname[Number(index)].id;
    item.tag_name = this.tagsname[Number(index)].tag_name;
    this.tagslist.push(item)

    console.log(index);
  }
}
