'use strict';

var React = require('react');
var objectAssign = require('object-assign');

module.exports = React.createClass({
  render: function() {
    var self = this;

    var styles = {
      container: {
        color: '#ffffff',
        backgroundColor: '#1e1e1e',
        height: '100%',
        overflowY: 'hidden'
      },
      title: {
        textAlign: 'center'
      },
      list: {
        listStyleType: 'none',
        paddingLeft: 0
      }
    };
    var itemStyles = {
      item: {

      },
      label: {
        marginLeft: '1em',
        marginRight: '1em'
      },
      value: {
        float: 'right',
        marginLeft: '1em',
        marginRight: '1em'
      }
    };

    var data = {
      title: undefined,
      items: []
    };

    function useIfDefined(previous, next) {
      if (typeof next === 'undefined') {
        return previous;
      }
      return next;
    }

    function updateData(data, partialData) {
      data.title = useIfDefined(data.title, partialData.title);
    }

    function findBand(value) {
      var matchingBand = null;

      if (typeof self.props.bands !== 'undefined') {
        self.props.bands.some(function(band) {
          var matches = true;

          if (typeof band.min !== 'undefined') {
            if (band.minExclusive) {
              matches = (value > band.min);
            }
            else {
              matches = (value >= band.min);
            }
          }

          if (matches) {
            if (typeof band.max !== 'undefined') {
              if (band.maxExclusive) {
                matches = (value < band.max);
              }
              else {
                matches = (value <= band.max);
              }
            }

            if (matches) {
              matchingBand = band;
              return true;
            }
          }

          return false;
        });
      }

      return matchingBand;
    }

    updateData(data, self.props);

    var metrics = self.props.metrics;
    console.log('ListTile metrics', metrics);

    if (metrics && metrics.length > 0) {
      metrics.forEach(function(metric) {
        updateData(data, metric);

        metric.points.forEach(function(point) {
          data.items.push({
            label: point.label,
            value: point.value
          });
        });
      });
    }

    var title = (typeof data.title === 'undefined') ? '' : <div style={styles.title}>{data.title}</div>;
    var items = [];

    data.items.forEach(function(item) {
      var band = findBand(item.value);
      var inheritedStyles = objectAssign({}, itemStyles, band ? band.styles : {});
      items.push(<li style={inheritedStyles.item}><span style={inheritedStyles.label}>{item.label}</span><span style={inheritedStyles.value}>{item.value}</span></li>);
    });

    var list;

    if (self.props.ordered) {
      list = <ol style={styles.list}>{items}</ol>;
    }
    else {
      list = <ul style={styles.list}>{items}</ul>;
    }

    return (
      <div style={styles.container}>
        {title}
        {list}
      </div>
    );
  }
});
