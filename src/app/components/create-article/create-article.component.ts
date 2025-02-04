import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ArticleActions from '../../store/actions/article-catalog.actions';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catalogFeature } from '../../store/reducers/article-catalog.reducers';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateArticle } from '../../models/article';

@Component({
  selector: 'app-create-article',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-article.component.html',
  styleUrls: ['../styles/index.scss', './create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  store = inject(Store);
  categories$ = this.store.select(catalogFeature.selectCategories);

  articleForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    subtitle: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    categoryId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.store.dispatch(ArticleActions.loadCategories());
  }

  onSubmit(): void {
    console.log(this.articleForm.value);
    this.store.dispatch(
      ArticleActions.createArticle({
        article: this.articleForm.value as CreateArticle,
      })
    );
  }
}
