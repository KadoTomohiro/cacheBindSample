import { Component, HostListener, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  store: Store;
  key: string;
  constructor(private cacheService: CacheService)  {
    this.store = new Store();
    this.key = this.cacheService.bind(this.store);
    this.cacheService.restore(this.key)
      .then(cacheData => {
        if (cacheData) {
          this.store = {...cacheData};
        }
      });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  caching() {
    this.cacheService.store(this.key);
  }

  ngOnDestroy() {
    this.caching();
  }
}

class Store {
  title: string;
  detail: string;
}


@Injectable({
  providedIn: 'root'
})
class CacheService {

  cacheStore: { [key: string]: Cache };

  constructor(private router: Router, private cacheRepository: CacheRepository) {
    this.cacheStore = {};
  }

  bind(store: any, keyGenerator: KeyGenerator = new UrlContextKeyGenerator(this.router.url)): string {
    const newCache = new Cache(store, keyGenerator);
    const key = newCache.key;
    this.cacheStore[key] = newCache;
    return key;
  }

  store(key: string): Promise<any> {
    const cache = this.getCache(key);
    return this.cacheRepository.store(cache);
  }
  restore(key: string): Promise<any> {
    return this.cacheRepository.restore(key);
  }

  private getCache(key: string) {
    return this.cacheStore[key];
  }
}



class Cache {
  readonly key: string;
  constructor(public store: any, private keyGenerator: KeyGenerator) {
    this.key = this.keyGenerator.generate();
  }
}

class UrlContextKeyGenerator implements KeyGenerator {
  constructor(private url: string) {
  }

  generate(): string {
    return JSON.stringify({url: this.url});
  }
}

interface KeyGenerator {
  generate(): string;
}
@Injectable()
export abstract class CacheRepository {
  abstract store(cache: Cache): Promise<any>;
  abstract restore(key: string): Promise<any | null>;
}

export class LocalStorageCacheRepository implements CacheRepository {
  restore(key: string): Promise<any | null> {
    return new Promise<any|null>((resolve => {
      const rowData = localStorage.getItem(key);
      const result = JSON.parse(rowData);
      resolve(result);
    }));
  }

  store(cache: Cache): Promise<any> {
    return new Promise<any>(resolve => {
      const storeData = JSON.stringify(cache.store);
      localStorage.setItem(cache.key, storeData);
      resolve();
    });
  }

}
