import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import AddRemoveItem from './Furniture/AddRemoveItem';
import AddFurniture from './Furniture/AddFurniture';
import UpdateFurniture from './Furniture/UpdateFurniture';
import AddRemoveCosItem from './Cosmetics/AddRemoveCosItem';
import AddCosmetic from './Cosmetics/AddCosmetic';
import UpdateCosmetic from './Cosmetics/UpdateCosmetic';
import AddRemoveSaleItem from './Sales/AddRemoveSaleItem';
import AddSale from './Sales/AddSale';
import UpdateSale from './Sales/UpdateSale';
import AddRemoveElectronicsItem from './Electronics/AddRemoveElectronicsItem';
import AddElectronics from './Electronics/AddElectronics';
import UpdateElectronics from './Electronics/UpdateElectronics';
import AddRemoveFashionItem from './Fashion/AddRemoveFashionItem';
import AddFashion from './Fashion/AddFashion';
import UpdateFashion from './Fashion/UpdateFashion';
import AddRemoveGroceryItem from './Grocery/AddRemoveGroceryItem';
import AddGrocery from './Grocery/AddGrocery';
import UpdateGrocery from './Grocery/UpdateGrocery';
import AddRemoveEntertainmentItem from './Entertainment/AddRemoveEntertainmentItem';
import AddEntertainment from './Entertainment/AddEntertainment';
import UpdateEntertainment from './Entertainment/UpdateEntertainment';
import AddRemoveHealthItem from './Health/AddRemoveHealthItem';
import AddHealth from './Health/AddHealth';
import UpdateHealth from './Health/UpdateHealth';
import AddRemoveOffersItem from './Offers/AddRemoveOffersItem';
import AddOffers from './Offers/AddOffers';
import UpdateOffers from './Offers/UpdateOffers';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} >
          <Route path='/addremoveitems' element={<AddRemoveItem/>} />
          <Route path='/createFurniture' element={<AddFurniture/>} />
          <Route path='/furnitureUpdate/:id' element={<UpdateFurniture/>} />
          <Route path='/addremovecositems' element={<AddRemoveCosItem/>} />
          <Route path='/createcosmetic' element={<AddCosmetic/>} />
          <Route path='/cosmeticUpdate/:id' element={<UpdateCosmetic/>} />
          <Route path='/addremovesaleitems' element={<AddRemoveSaleItem/>} />
          <Route path='/createsale' element={<AddSale/>} />
          <Route path='/saleUpdate/:id' element={<UpdateSale/>} />
          <Route path='/addremoveelectronicsitems' element={<AddRemoveElectronicsItem/>} />
          <Route path='/createelectronics' element={<AddElectronics/>} />
          <Route path='/electronicsUpdate/:id' element={<UpdateElectronics/>} />
          <Route path='/addremovefashionitems' element={<AddRemoveFashionItem/>} />
          <Route path='/createfashion' element={<AddFashion/>} />
          <Route path='/fashionUpdate/:id' element={<UpdateFashion/>} />
          <Route path='/addremovegroceryitems' element={<AddRemoveGroceryItem/>} />
          <Route path='/creategrocery' element={<AddGrocery/>} />
          <Route path='/groceryUpdate/:id' element={<UpdateGrocery/>} />
          <Route path='/addremoveentertainmentitems' element={<AddRemoveEntertainmentItem/>} />
          <Route path='/createentertainment' element={<AddEntertainment/>} />
          <Route path='/entertainmentUpdate/:id' element={<UpdateEntertainment/>} />
          <Route path='/addremovehealthitems' element={<AddRemoveHealthItem/>} />
          <Route path='/createhealth' element={<AddHealth/>} />
          <Route path='/healthUpdate/:id' element={<UpdateHealth/>} />
          <Route path='/addremoveoffersitems' element={<AddRemoveOffersItem/>} />
          <Route path='/createoffers' element={<AddOffers/>} />
          <Route path='/offersUpdate/:id' element={<UpdateOffers/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
