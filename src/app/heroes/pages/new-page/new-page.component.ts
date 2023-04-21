import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  constructor(
    private heroesService : HeroesService,
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private snackbar: MatSnackBar
    ){

  }
  ngOnInit(): void {

    if(!this.router.url.includes("edit")) return;

    this.activatedRoute.params
    .pipe(
      switchMap( ({id})  => this.heroesService.getHeroById(id))
      )
    .subscribe(hero => {
      if(!hero) return this.router.navigateByUrl("/");
      this.heroForm.reset(hero);
      return;
    })
  }

  public heroForm : FormGroup = new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl('', { nonNullable: true } ),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),   
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl('')
  });

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  get currentHero(): Hero{
    const hero : Hero = this.heroForm.value as Hero;
    return hero;
  }
  
  onSubmit(){
    if(this.heroForm.invalid) return;
    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe(hero => this.showSnackbar(`${hero.superhero} update!`))
      return;
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe(hero => {
      this.router.navigate(["/heroes/edit", hero.id])
      this.showSnackbar(`${hero.superhero} created!`)
    })
  }

  showSnackbar(msg: string){
    this.snackbar.open(msg, 'done', {
      duration: 2500
    })
  }

}
