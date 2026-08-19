import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCardComponent } from './skill-card/skill-card.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ExperienceCardComponent } from './experience-card/experience-card.component';
import { ParticlesOverlayComponent } from './particles-overlay/particles-overlay.component';
import { IntroSplashComponent } from './intro-splash/intro-splash.component';
import { SkillSectionComponent } from './skill-section/skill-section.component';

@NgModule({
  declarations: [
    SkillCardComponent,
    ProjectCardComponent,
    ExperienceCardComponent,
    ParticlesOverlayComponent,
    IntroSplashComponent,
    SkillSectionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkillCardComponent,
    ProjectCardComponent,
    ExperienceCardComponent,
    ParticlesOverlayComponent,
    IntroSplashComponent,
    SkillSectionComponent
  ]
})
export class SharedComponentsModule { }
