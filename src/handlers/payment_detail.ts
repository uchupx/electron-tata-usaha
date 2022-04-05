import { DetailsPaginatedPayload } from "@/db/enums/paginated";
import * as PaymentDetailAction from "@/db/action/payment_detail"
import { RelationHandler, PaymentWithRelations, Relations } from "./relation";
import { PaymentDetail } from "@/db/model/payment";


interface PaginatedDetails {
  data: Array<PaymentWithRelations>;
  totalItems: number;
  limit: number;
  offset: number;
}

export class PaymentDetailHandler {
  public async findPaginated(query: DetailsPaginatedPayload, relations: Relations) {
    const results = await PaymentDetailAction.findRawPaginated(query)
    const handler = new RelationHandler
    const response: PaginatedDetails = {
      data: [],
      totalItems: results.count,
      limit: query.limit,
      offset: query.offset,
    }

    let details = [] as Array<PaymentWithRelations>

    for (const idx in results.rows) {
      const result = results.rows[idx]
      const detail = new PaymentDetail

      detail.rawTupleToModel(result)
      details.push(detail)
    }

    details = await handler.paymentDetailRelations(details, relations)
    response.data = details

    return response
  }
}