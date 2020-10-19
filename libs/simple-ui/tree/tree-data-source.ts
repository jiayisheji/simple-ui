import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SimTreeControl } from './tree-control';
import { SimTreeFlattener } from './tree-flattener';

export class SimTreeDataSource<T, F> extends DataSource<F> {
  _flattenedData = new BehaviorSubject<F[]>([]);

  _expandedData = new BehaviorSubject<F[]>([]);

  _data: BehaviorSubject<T[]>;
  get data() {
    return this._data.value;
  }
  set data(value: T[]) {
    this._data.next(value);
    this._flattenedData.next(this._treeFlattener.flattenNodes(this.data));
    this._treeModel.dataNodes = this._flattenedData.value;
  }

  constructor(private _treeModel: SimTreeControl<F>, private _treeFlattener: SimTreeFlattener<T, F>) {
    super();
    this._data = new BehaviorSubject([]);
  }

  connect(): Observable<F[]> {
    const changes = [this._treeModel.expansionModel.changed, this._flattenedData];
    return merge(...changes).pipe(
      map(() => {
        this._expandedData.next(this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeModel));
        return this._expandedData.value;
      })
    );
  }

  disconnect() {
    // no op
  }
}
