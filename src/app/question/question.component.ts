import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: string = "";
  public questionsList: any = [];
  public currentQuestions: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$:any;
  progress:string ="0";
  isQuizCompleted:boolean = false;
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions() {
    this.questionService.getQuestion()
      .subscribe(res => {
        this.questionsList = res.questions;
      })

  }
  nextQuestion() {
    this.currentQuestions++;
  }

  previousQuestion() {
    this.currentQuestions--;
  }

  answer(currentQno: number, option: any) {
    if(currentQno === this.questionsList.length){
      this.isQuizCompleted = true;
      this.stopCounter();

    }
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
      this.currentQuestions++; 
      this.resetCounter();
      this.getProgressPercentage();
      }, 1000);

    } else {
      setTimeout(() =>{
        this.currentQuestions++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercentage(); 
      },1000);
      this.points -= 10;
    }
  }
startCounter(){
  this.interval$ = interval(1000)
  .subscribe(val=>{
    this.counter--;
    if(this.counter===0){
      this.currentQuestions++;
      this.counter=60;
      this.points-=10;
    }
  });
  setTimeout(() => {
    this.interval$.unsubscribe()
  }, 600000);

}
stopCounter(){
  this.interval$.unsubscribe();
  this.counter=0;
}
resetCounter(){
  this.stopCounter();
  this.counter=60;
  this.startCounter();
}

resetQuiz(){
  this.resetCounter();
  this.getAllQuestions();
  this.points = 0;
  this.counter = 60;
  this.currentQuestions = 0;
  this.progress = "0";
  
}
getProgressPercentage(){
  this.progress = ((this.currentQuestions/this.questionsList.length)*100).toString();
  return this.progress;
}


}
