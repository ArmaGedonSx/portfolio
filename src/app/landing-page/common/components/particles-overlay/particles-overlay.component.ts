import { Component, AfterViewInit, OnInit } from '@angular/core';
import particlesConfig from '../../../../../assets/config/particles.config.json';

declare var particlesJS: any;

@Component({
  selector: 'app-particles-overlay',
  templateUrl: './particles-overlay.component.html',
  styleUrls: ['./particles-overlay.component.scss']
})
export class ParticlesOverlayComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initParticles();
  }

  private initParticles(): void {
    particlesJS('particles-js', particlesConfig);
  }
}
