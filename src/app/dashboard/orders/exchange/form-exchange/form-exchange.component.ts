import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { OrderDetail } from 'src/app/model/orderDetail.model';
import { EmptyValidator } from 'src/validators/emailOrPhone.validator';
import { ExchangeService } from '../exchange.service';
import { Exchange, ExchangeImage } from 'src/app/model/exchange.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ORDER_DETAIL_STATUS } from 'src/app/constants/constant.constant';

@Component({
  selector: 'app-form-exchange',
  templateUrl: './form-exchange.component.html',
  styleUrls: ['./form-exchange.component.scss'],
})
export class FormExchangeComponent implements OnInit {
  @Input() orderDetail!: OrderDetail;
  @Input() isExchange!: boolean;
  @Input() orderId!: number;
  @Input() orderStatus!: number;
  formExchange!: FormGroup;
  images: string[] = [];
  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private exchangeService: ExchangeService,
    private modalRef: NzModalRef,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.formExchange = this.fb.group({
      quantity: [1],
      reason: ['', Validators.compose([EmptyValidator()])],
    });
  }
  onSubmit() {
    if (this.formExchange.valid && this.images.length) {
      let valueForm = this.formExchange.value;
      let data: Exchange = {
        id: 0,
        reason: valueForm.reason,
        exchangeImages: this.images.map(
          (image: any) => ({ id: 0, image } as ExchangeImage)
        ),
      };
      this.orderDetail.exchange = data;
      this.orderDetail.quantity = valueForm.quantity * -1;
      this.orderDetail.statusOrderDetail = ORDER_DETAIL_STATUS.RETURN_PENDING;
      this.exchangeService
        .returnOrderDetail({
          orderDetails: this.orderDetail,
          orderId: this.orderId,
          statusOrder: this.orderStatus,
        })
        .subscribe((res) => {
          console.log(res);

          if (res) {
            this.commonService.success('Yêu cầu trả hàng thành công');
            this.modalRef.destroy(true);
          }
        });
    }
  }
  removeImage(i: number) {
    this.images.splice(i, 1);
  }
  changeImage(event: any) {
    let n = Date.now();
    const file = event.target.files[0];
    const filePath = `product_images/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`product_images/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            if (url) {
              this.images.push(url);
            }
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
  }
  editorInstance: any;
  imageHandler(event: any) {
    this.editorInstance = event;
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('image', () => {
      let data = this.editorInstance;
      if (this.editorInstance) {
        let range = this.editorInstance.getSelection();
        if (range) {
          let input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.addEventListener('change', () => {
            const file = input.files![0];
            let n = Date.now();
            const filePath = `product_images/${n}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`product_images/${n}`, file);
            task
              .snapshotChanges()
              .pipe(
                finalize(() => {
                  fileRef.getDownloadURL().subscribe((url: any) => {
                    if (url) {
                      data.insertEmbed(range.index, 'image', url);
                    }
                  });
                })
              )
              .subscribe();
          });
          input.click();
        }
      }
    });
  }
}
