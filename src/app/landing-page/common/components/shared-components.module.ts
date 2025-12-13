import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCardComponent } from './skill-card/skill-card.component';
import { ProyectCardComponent } from './proyect-card/proyect-card.component';
import { ExperienceCardComponent } from './experience-card/experience-card.component';
import { ParticlesOverlayComponent } from './particles-overlay/particles-overlay.component';
import { IntroSplashComponent } from './intro-splash/intro-splash.component';
import { SkillSectionComponent } from './skill-section/skill-section.component';


const components = [SkillCardComponent,ProyectCardComponent,ExperienceCardComponent,ParticlesOverlayComponent,IntroSplashComponent,SkillSectionComponent];

@NgModule({
  declarations: [
    ...components,
    
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...components
  ]
})
export class SharedComponentsModule { }
