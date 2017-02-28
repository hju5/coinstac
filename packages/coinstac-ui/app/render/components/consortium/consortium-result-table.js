import React, { PropTypes } from 'react';
import scino from 'scino';
import { isNumber, round } from 'lodash';

function formatNumber(num) {
  return num > 100 || num < 0.01 ? scino(num, 5) : round(num, 5);
}

/**
 * Get a table data element.
 *
 * @param {number} value
 * @param {number} index
 * @returns {React.Component}
 */
function getTableDataElement(value, index) {
  const output = isNumber(value) ?
    <samp>{formatNumber(value)}</samp> :
    <samp className="text-warning">Not a Number</samp>;

  return <td key={index}>{output}</td>;
}

const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

/**
 * Get formatted data transformed to components.
 *
 * @param {Object} props Computation result
 * @param {number[]} props.betaVector
 * @param {string[]} props.covariates
 * @param {string} props.name
 * @param {number[]} props.pValue
 * @param {number} props.rSquared
 * @param {number[]} props.tValue
 * @returns {React.Component}
 */
export default function ConsortiumResultTable({
  betaVector,
  covariates,
  name,
  pValue,
  rSquared,
  tValue,
}) {
  return (
    <div>
      <h4>{name}</h4>
      <dl className="consortium-result-list">
        <dt>R²</dt>
        <dd><samp>{formatNumber(rSquared)}</samp></dd>
      </dl>
      <table className="consortium-result-table table">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Row label:</span>
            </th>
            <th scope="col">
              β{`${subscripts[0]} `}
              <span className="text-muted">(Intercept)</span>
            </th>
            {covariates.map((covariate, i) => (
              <th key={i} scope="col">
                β{`${subscripts[i + 1]} `}
                <span className="text-muted">({covariate})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">β Vector</th>
            {betaVector.map(getTableDataElement)}
          </tr>
          <tr>
            <th scope="row">P Value</th>
            {pValue.map(getTableDataElement)}
          </tr>
          <tr>
            <th scope="row">T Value</th>
            {tValue.map(getTableDataElement)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

ConsortiumResultTable.displayName = 'ConsortiumResultTable';

ConsortiumResultTable.propTypes = {
  betaVector: PropTypes.arrayOf(PropTypes.number).isRequired,
  covariates: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  pValue: PropTypes.arrayOf(PropTypes.number).isRequired,
  rSquared: PropTypes.number.isRequired,
  tValue: PropTypes.arrayOf(PropTypes.number).isRequired,
};