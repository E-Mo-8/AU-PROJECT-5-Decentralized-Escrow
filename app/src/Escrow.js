import { Alchemy, Network, Utils} from 'alchemy-sdk';
export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div className="lbl"><b>Arbiter:</b>&nbsp;{arbiter} </div>
        </li>
        <li>
          <div className="lbl"><b>Beneficiary:</b>&nbsp;{beneficiary} </div>
        </li>
        <li>
          <div className="lbl"><b>Value:</b>&nbsp;{Utils.formatEther(value)}&nbsp;ether</div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve!
        </div>
      </ul>
    </div>
  );
}
