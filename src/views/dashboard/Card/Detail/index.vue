<template>
    <div>
      <div class="card-header">
        <span>{{title}}</span>
        <svg t="1663665719216" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2730" width="32" height="32"><path d="M512 3.413333c280.849067 0 508.586667 199.273813 508.586667 444.94848 0 140.427947-74.519893 265.53344-190.65856 347.11552V1020.586667l-222.839467-135.168c-30.859947 5.147307-62.552747 8.021333-95.085227 8.021333-280.845653 0-508.586667-199.28064-508.586666-445.078187C3.413333 202.687147 231.150933 3.413333 512 3.413333z m-158.96576 603.921067h317.805227c17.578667 0 31.812267-14.2336 31.812266-31.819093a31.798613 31.798613 0 0 0-31.812266-31.80544h-317.805227c-17.578667 0-31.812267 14.2336-31.812267 31.80544 0.116053 17.585493 14.349653 31.819093 31.812267 31.819093z m-63.511893-190.665387h444.951893c17.578667 0 31.812267-14.2336 31.812267-31.812266a31.802027 31.802027 0 0 0-31.812267-31.81568H289.522347a31.802027 31.802027 0 0 0-31.81568 31.81568c0 17.578667 14.2336 31.812267 31.81568 31.812266z" p-id="2731" fill="#f4ea2a"></path></svg>
      </div>
      <div class="card-content">{{count}}</div>
      <div class="card-charts">
        <slot name="charts"></slot>
      </div>
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "",
    props: ["title", "count"]
  };
  </script>
  
  <style scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
  }
  .card-content {
    font-size: 30px;
    padding: 10px 0px;
  }
  .card-charts {
    height: 50px;
  }
  .card-footer {
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
  </style>
  