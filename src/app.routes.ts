import { Routes } from '@angular/router';
import { PublicListingComponent } from './components/public-listing/public-listing.component';
import { EnquiryFormComponent } from './components/enquiry-form/enquiry-form.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

export const routes: Routes = [
  { path: '', component: PublicListingComponent },
  { path: 'enquiry/:regNo', component: EnquiryFormComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: '**', redirectTo: '' }
];
