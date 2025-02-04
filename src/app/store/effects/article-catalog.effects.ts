import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ArticleCatalogService } from '../../services/article-catalog.service';
import * as CatalogActions from '../actions/article-catalog.actions';
import { Router } from '@angular/router';
import * as NotificationActions from '../actions/notification.actions';

@Injectable()
export class ArticleCatalogEffects {
  loadArticles$;
  loadTopArticles$;
  selectArticle$;
  loadCategories$;
  createArticle$;
  createArticleSuccess$;
  loadArticlesSuccess$;

  constructor(
    private actions$: Actions,
    private articleCatalogService: ArticleCatalogService,
    private router: Router
  ) 
  {
    this.loadArticles$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CatalogActions.loadArticles),
        mergeMap(({pageNumber, pageSize}) =>
          this.articleCatalogService.getAllArticles(pageNumber, pageSize).pipe(
            map((result) => CatalogActions.loadArticlesSuccess({ articles: result.articles, totalPages: result.totalPages })),
            catchError((error) =>
              of(CatalogActions.loadArticlesFailure({ error: error.message }))
            )
          )
        )
      )
    );

    this.loadTopArticles$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CatalogActions.loadTopArticles),
        mergeMap(({ pageSize }) =>
          this.articleCatalogService.getAllArticles(1, pageSize).pipe(
            map((result) => CatalogActions.loadTopArticlesSuccess({ articles: result.articles })),
            catchError((error) =>
              of(CatalogActions.loadTopArticlesFailure({ error: error.message }))
            )
          )
        )
      )
    );

    this.selectArticle$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(CatalogActions.selectArticle),
          tap(({ articleId }) => {
            this.router.navigate(['article'], {
              queryParams: { id: articleId },
            });
          })
        ),
      { dispatch: false }
    );

    this.loadCategories$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CatalogActions.loadCategories),
        mergeMap(() =>
          this.articleCatalogService.getCategories().pipe(
            map((categories) =>
              CatalogActions.loadCategoriesSuccess({ categories })
            ),
            catchError((error) =>
              of(CatalogActions.loadCategoriesFailure({ error: error.message }))
            )
          )
        )
      )
    );

    this.createArticle$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CatalogActions.createArticle),
        mergeMap((params) =>
          this.articleCatalogService.createArticle(params.article).pipe(
            map(() => CatalogActions.createArticleSuccess()),
            catchError((error) => {
              console.log(error);
              return of(
                CatalogActions.createArticleFailure({ error: error.message })
              );
            })
          )
        )
      )
    );

    this.createArticleSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(CatalogActions.createArticleSuccess),
          tap(() => {
            this.router.navigate(['/'], {});
            NotificationActions.displaySuccess({
              title: "Increment",
              description: "Counter was incremented by 1"
            })
          })
        ),
      { dispatch: false }
    );

    this.loadArticlesSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CatalogActions.loadArticlesSuccess),
        mergeMap((action) => 
          of(NotificationActions.displaySuccess({
            title: "Articles Loaded successfully",
            description: action.articles.length + " articles loaded"
          }))
        ),
      )
    );
  }
}
