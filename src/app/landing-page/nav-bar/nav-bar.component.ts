import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit,OnChanges {
  @Input() linksNavBar!:any;
  @Input() selected: string='';
  @Input() open: boolean=false;
  links: Array<any> = [];
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!!this.links && changes['linksNavBar']?.currentValue){
      this.links = Object.keys(this.linksNavBar).map((key)=>{
        return {
          key: key,
          name: this.linksNavBar[key]
        };
      })
    }
  }

  ngOnInit(): void {
  }

  onSelectItem(event:any,key:string){
    console.log('onSelectItem',key);
    // event.preventDefault();
    if(this.selected===key){
      this.selected='';
    }else{
      this.selected=key;
    }
    setTimeout(() => {
      const item = document.querySelector(`#${key}`);
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  onLogo(){
    this.selected='';
  }
  toggleMenu() {
    this.open = !this.open;
  }

  closeMenu() {
    this.open = false;
  }
}
