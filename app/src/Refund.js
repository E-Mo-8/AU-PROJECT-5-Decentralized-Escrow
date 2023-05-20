import { Alchemy, Network, Utils } from "alchemy-sdk";
export default function Refund({
  address,
  arbiter,
  beneficiary,
  value,
  handleRefund,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
       
          <div
            style={{color: "red"}}
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();

              handleRefund();
            }}
          >
            Refund
          </div>
        
      </ul>
    </div>
  );
}
