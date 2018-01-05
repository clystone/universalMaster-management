/* version 1.0*/
(function () {
    'use strict';
    let myApp = angular.module("myApp", ['ui.router', 'ui.bootstrap','ui.router.state.events']);
    const url = 'http://192.168.2.103:8080';
    // const url = 'https://shifu.jack-kwan.com';
    myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state("login", {
                url: "/",
                templateUrl: "login.html",
                controller: 'LoginCtr'
            })
            .state("main", {
                url: "/main",
                templateUrl: "main/main.view.html",
                controller: 'MainCtr'
            })
            .state("main.registerAudit", {
                url: "/registerAudit",
                templateUrl: "registerAudit/registerAudit.view.html",
                controller: 'registerAuditCtr'
            })
            .state("main.findMaster", {
                url: "/findMaster",
                templateUrl: 'findMaster/findMaster.view.html',
                controller: 'findMasterCtr'
            })
            .state("main.findComplaint", {
                url: "/findComplaint",
                templateUrl: 'findComplaint/findComplaint.view.html',
                controller: 'findComplaintCtr'
            })
            .state("main.findComment", {
                url: "/findComment",
                templateUrl: 'findComment/findComment.view.html',
                controller: 'findCommentCtr'
            })
            .state("main.findUser", {
                url: "/findUser",
                templateUrl: 'findUser/findUser.view.html',
                controller: 'findUserCtr'
            })
            .state("main.findOrder", {
                url: "/findOrder",
                templateUrl: 'findOrder/findOrder.view.html',
                controller: 'findOrderCtr'
            })
          .state("main.searchOrder", {
            url: "/searchOrder",
            templateUrl: 'searchOrder/searchOrder.view.html',
            controller: 'searchOrderCtr'
          })
            .state("main.masterDetail", {
                url: "/masterDetail/:id",
                templateUrl: 'masterDetail/masterDetail.view.html',
                controller: 'masterDetailCtr'
            })
            .state("main.commentDetail", {
                url: "/commentDetail",
                templateUrl: 'commentDetail/commentDetail.view.html',
                controller: 'commentDetailCtr'
            })
            .state("main.userDetail", {
                url: "/userDetail/:id",
                templateUrl: 'userDetail/userDetail.view.html',
                controller: 'userDetailCtr'
            })
            .state("main.orderDetail", {
                url: "/orderDetail:orderId",
                templateUrl: 'orderDetail/orderDetail.view.html',
                controller: 'orderDetailCtr'
            })
            .state("main.findSkills", {
                url: "/findSkills",
                templateUrl: 'findSkills/findSkills.view.html',
                controller: 'findSkillsCtr'
            })
            .state("main.findWithdraw", {
                url: "/findWithdraw",
                templateUrl: 'findWithdraw/findWithdraw.view.html',
                controller: 'findWithdrawCtr'
            })
            .state("main.findAgency", {
                url: "/findAgency",
                templateUrl: 'findAgency/findAgency.view.html',
                controller: 'findAgencyCtr'
            })
            .state("main.findhouses", {
                url: "/findhouses",
                templateUrl: 'findhouses/findhouses.view.html',
                controller: 'findhousesCtr'
            })
            .state("main.addAgency", {
                url: "/addAgency",
                templateUrl: 'addAgency/addAgency.view.html',
                controller: 'addAgencyCtr'
            })
            .state("main.findPromoter", {
                url: "/findPromoter",
                templateUrl: 'findPromoter/findPromoter.view.html',
                controller: 'findPromoterCtr'
            })
            .state("main.findCity", {
                url: "/findCity",
                templateUrl: 'findCity/findCity.view.html',
                controller: 'findCityCtr'
            })
    });

    myApp.controller('appCtr', ['$scope','$rootScope','locals','$state', function ($scope,$rootScope,locals,$state) {

    }]);

    myApp.controller('LoginCtr', ['$scope', '$http', '$timeout', 'locals', '$state', function ($scope, $http, $timeout, locals, $state) {
        locals.set("userToken", '');

        $scope.LoginIn = function () {
            $http.post(url + '/api/manager/login', {
                phone: $scope.phone1,
                pw: $scope.pw1
            })
                .then(function (response) {
                    console.log(response.data);
                    $scope.msg = response.data.msg;
                    if (response.data.info == 6) {
                        $scope.oftenToast = true;
                        $timeout(function () {
                            $scope.oftenToast = false;
                        }, 1000);
                    }
                    else if (response.data.info == 1) {
                        locals.set("userToken", response.data.parms.token);
                        console.log("登录成功");
                        $state.go("main");
                    }
                    else {
                        // console.log(response.data.parms.token);
                        $scope.accountToast = true;
                        $timeout(function () {
                            $scope.accountToast = false;
                        }, 1000);
                    }

                })
        }
    }]);

    myApp.controller('MainCtr', ['$scope','$rootScope','locals', function ($scope,$rootScope,locals) {
        $(function () {
            let Accordion = function (el, multiple) {
                this.el = el || {};
                this.multiple = multiple || false;

                // Variables privadas
                let links = this.el.find('.link');
                // Evento
                links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
            };

            Accordion.prototype.dropdown = function (e) {
                let $el = e.data.el;
                let $this = $(this);
                let $next = $this.next();

                $next.slideToggle();
                $this.parent().toggleClass('open');

                if (!e.data.multiple) {
                    $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
                }
            };

            let accordion = new Accordion($('#accordion'), false);
        });
    }]);

    myApp.controller('findMasterCtr', ['$scope', '$http', '$state', 'locals', '$timeout','$rootScope', function ($scope, $http, $state, locals, $timeout,$rootScope) {
        $scope.state1 = 2;
        $scope.states = [
            {des: 0, value: '未有数据'},
            {des: 1, value: '绑定手机'},
            {des: 2, value: '绑定身份证待审核'},
            {des: 3, value: '审核通过'},
            {des: 4, value: '封号'}
        ];
        $scope.state = $scope.states[2];

        let token1 = locals.get("userToken");
        $http.get(url + '/api/master/findAllm/2?page=1&size=5', {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.data = res.data.parms.master;
                    $scope.max = res.data.parms.maxSize;
                    // //翻页
                    $scope.currentPage = 1;
                    $scope.count = "5";
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/master/findAllm/' + $scope.state1 + '?page=' + $scope.currentPage + '&size=5', {headers: {"TOKEN": token1}})
                            .then(res => {
                                $scope.data = res.data.parms.master;
                            })
                    };
                }
            });

        // $scope.state1 = 2;
        $scope.change1 = function (state) {
            $scope.state1 = this.state.des;
            console.log($scope.state1);
            $http.get(url + '/api/master/findAllm/' + $scope.state1 + '?page=1&size=5', {headers: {"TOKEN": token1}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else {
                        console.log(res.data);
                        $scope.data = res.data.parms.master;
                        $scope.max = res.data.parms.maxSize;
                        $scope.currentPage = 1;     //当前页

                        $scope.totalItems = $scope.max;    //所有页面中的项目总数
                        $scope.maxSize = 5;
                        $scope.setPage = function (pageNo) {
                            $scope.currentPage = pageNo;
                        };
                        // $scope.maxSize = 5;
                        $scope.pageChanged = function () {
                            console.log($scope.currentPage);
                            $http.get(url + '/api/master/findAllm/' + $scope.state1 + '?page=' + $scope.currentPage + '&size=5', {headers: {"TOKEN": token1}})
                                .then(res => {
                                    $scope.data = res.data.parms.master;
                                })
                        };
                    }

                });

        };

        $scope.passMaster = function (current, $event) {
            console.log(current.id);
            let currentId = current.id;
            let pass = true;
            $http.post(url + '/api/manager/pass/' + currentId + '/' + pass, {}, {headers: {"TOKEN": token1}})
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.info == 1) {
                        $scope.updateSuccess = true;
                        $timeout(function () {
                            $scope.updateSuccess = false;
                        }, 1000).then(() => {
                            $state.reload();
                        });
                    }
                    else if (res.data.info == 18) {
                        $state.go("login");
                    }
                })

        };

        $scope.rejectMaster = function (current, $event) {
            console.log(current.id);
            let currentId = current.id;
            let pass = false;
            $http.post(url + '/api/manager/pass/' + currentId + '/' + pass, {}, {headers: {"TOKEN": token1}})
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.info == 1) {
                        $scope.rejectSuccess = true;
                        $timeout(function () {
                            $scope.rejectSuccess = false;
                        }, 1000).then(() => {
                            $state.reload();
                        });
                    }
                    else if (res.data.info == 18) {
                        $state.go("login");
                    }
                })

        };

        $scope.freezeMaster = function (current, $event) {
            let currentId = current.id;
            let lock = true;
            $http.post(url + '/api/manager/lock/' + currentId + '/' + lock, {}, {headers: {"TOKEN": token1}})
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.info == 1) {
                        $scope.freezeSuccess = true;
                        $timeout(function () {
                            $scope.freezeSuccess = false;
                        }, 1000).then(() => {
                            $state.reload();
                        });
                    }
                    else if (res.data.info == 18) {
                        $state.go("login");
                    }
                })
        };

        $scope.unfreezeMaster = function (current, $event) {
            let currentId = current.id;
            let lock = false;
            $http.post(url + '/api/manager/lock/' + currentId + '/' + lock, {}, {headers: {"TOKEN": token1}})
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.info == 1) {
                        $scope.unfreezeSuccess = true;
                        $timeout(function () {
                            $scope.unfreezeSuccess = false;
                        }, 1000).then(() => {
                            $state.reload();
                        });
                    }
                    else if (res.data.info == 18) {
                        $state.go("login");
                    }
                })
        };

        $scope.showBig = function (current, $event) {
            console.log(current.id);
            $scope.curId = current.id;
            $scope.bigPic = true;
        };

        $scope.closeToast = function () {
            $scope.bigPic = false;
        }

        // $scope.passAudit = function () {
        //   let master = 0,pass=true;
        //   $http.post(url + '/api/master/findAllm/'+ master +'/'+ pass, {headers:{"TOKEN": token1}})
        //     .then(function (res) {
        //       console.log(res.data);
        //     })
        // };

    }]);

    myApp.controller('findCommentCtr', ['$scope', '$http', '$state', 'locals', '$stateParams', function ($scope, $http, $state, locals, $stateParams) {
        let token1 = locals.get("userToken");
        let params = $stateParams;
        // $http.get(url + '/api/comment/findSome/'+ params +'?page=1&size=10', {headers:{"TOKEN": token1}})
        //   .then(function (res) {
        //     console.log(res.data);
        //   });
        // $http.post(url + '/api/comment/locked/'+commentId+'/'+lock, {headers:{"TOKEN": token1}})
        //   .then(function (res) {
        //     console.log(res.data);
        //   });

    }]);

    myApp.controller('findComplaintCtr', ['$scope', '$http', '$state', 'locals', function ($scope, $http, $state, locals) {
        $scope.states = [
            {des: 0, value: '等待处理'},
            {des: 1, value: '处理中'},
            {des: 2, value: '处理完成'},
        ];
        $scope.state = $scope.states[0];
        let token1 = locals.get("userToken");
        $http.get(url + '/api/complaint/findAllm/0?page=1&size=10', {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.complaints = res.data.parms.complaints;
                    $scope.max = res.data.parms.maxSize;
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.currentPage = 1;     //当前页
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/complaint/findAllm/' + $scope.state1 + '?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token1}})
                            .then(res => {
                                $scope.complaints = res.data.parms.complaints;
                            })
                    }
                }

            });

        $scope.change1 = function (state) {
            $scope.state1 = this.state.des;
            console.log($scope.state1);
            $http.get(url + '/api/complaint/findAllm/' + $scope.state1 + '?page=1&size=10', {headers: {"TOKEN": token1}})
                .then(function (res) {
                    console.log(res.data);
                    $scope.complaints = res.data.parms.complaints;
                    $scope.max = res.data.parms.maxSize;
                    $scope.currentPage = 1;
                    if ($scope.max > 10) {
                        $scope.totalItems = $scope.max;    //所有页面中的项目总数
                        $scope.currentPage = 1;     //当前页
                        $scope.setPage = function (pageNo) {
                            $scope.currentPage = pageNo;
                        };
                        $scope.maxSize = 5;
                        $scope.pageChanged = function () {
                            console.log($scope.currentPage);
                            $http.get(url + '/api/complaint/findAllm/' + $scope.state1 + '?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token1}})
                                .then(res => {
                                    $scope.complaints = res.data.parms.complaints;
                                })
                        }
                    }
                });
        };
    }]);

    myApp.controller('findUserCtr', ['$scope', '$http', 'locals', function ($scope, $http, locals) {
        let token1 = locals.get("userToken");
        $http.get(url + '/api/user/findsome?page=1&size=10', {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.users = res.data.parms.users;
                    $scope.max = res.data.parms.maxSize;
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.currentPage = 1;     //当前页
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/user/findsome?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token1}})
                            .then(res => {
                                $scope.users = res.data.parms.users;
                            })
                    }
                }
            });
        // $http.get(url + '/api/user/findphone/'+phone, {headers:{"TOKEN": token1}})
        //   .then(function (res) {
        //     console.log(res.data);
        //   });

    }]);

    myApp.controller('findOrderCtr', ['$scope', '$http', 'locals', function ($scope, $http, locals) {
        let token1 = locals.get("userToken");
        let orderId = 1;
        $scope.states = [
            {des: 0, value: '取消的订单'},
            {des: 1, value: '未接单的订单'},
            {des: 2, value: '已接单的订单'},
            {des: 3, value: '待确认价格'},
            {des: 4, value: '待支付'},
            {des: 5, value: '已完成的订单'}
        ];
        $scope.state = $scope.states[5];
        $http.get(url + '/api/order/findsomemanager/5?page=1&size=10', {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.orders = res.data.parms.orders;
                    $scope.max = res.data.parms.maxSize;
                    $scope.currentPage = 1;
                    if ($scope.max > 10) {
                        $scope.totalItems = $scope.max;    //所有页面中的项目总数
                        $scope.currentPage = 1;     //当前页
                        $scope.setPage = function (pageNo) {
                            $scope.currentPage = pageNo;
                        };
                        $scope.maxSize = 5;
                        $scope.pageChanged = function () {
                            console.log($scope.currentPage);
                            $http.get(url + '/api/order/findsomemanager?1page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token1}})
                                .then(res => {
                                    $scope.users = res.data.parms.users;
                                })
                        }
                    }
                }

            });

        $scope.change1 = function (state) {
            $scope.state1 = this.state.des;
            console.log($scope.state1);
            $http.get(url + '/api/order/findsomemanager/' + $scope.state1 + '?page=1&size=10', {headers: {"TOKEN": token1}})
                .then(function (res) {
                    console.log(res.data);
                    $scope.orders = res.data.parms.orders;
                    $scope.max = res.data.parms.maxSize;
                    $scope.currentPage = 1;
                    $scope.totalItems = $scope.max;
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/order/findsomemanager/' + $scope.state1 + '?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token1}})
                            .then(res => {
                                $scope.orders = res.data.parms.orders;
                            })
                    }

                });
        };

        // $http.get(url + '/api/comment/findm/'+orderId, {headers:{"TOKEN": token1}})
        //   .then(function (res) {
        //     console.log(res.data);
        //   });
        // $http.post(url + '/api/comment/locked/'+commentId+'/'+lock, {headers:{"TOKEN": token1}})
        //   .then(function (res) {
        //     console.log(res.data);
        //   });

        $scope.showDetail = function (current, $event) {
            console.log(current.id);
            $scope.detailBox = true;
            $http.get(url + '/api/order/findmanager/' + current.id, {headers: {"TOKEN": token1}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else {
                        console.log(res.data);
                        $scope.order = res.data.parms.order;
                    }
                });
        };

        $scope.closeDetail = ()=>{
            $scope.detailBox = false;
        }


    }]);

    myApp.controller('searchOrderCtr', ['$scope', '$http', 'locals', function ($scope, $http, locals) {
      let token1 = locals.get("userToken");
      $scope.searchName = 100000;
      
      $scope.searchOrder = () => {
        if(!$scope.searchName){
          alert("请输入搜索内容")
        }
        else if($scope.searchName < 10000000000000){
          alert("长度至少14位")
        }
        else if(($scope.searchName+'').slice(0,6) != '100000'){
          alert("前6位一定是100000")
        }
        else{
          console.log($scope.searchName);
          $http.get(url + '/api/order/findnmanager/' + $scope.searchName, {headers: {"TOKEN": token1}})
            .then(function (res) {
              if (res.data.info == 18) {
                $state.go("login")
              }
              else {
                console.log(res.data);
                $scope.orders = res.data.parms.orders;
              }
            });
        }
      };
      
      $scope.showDetail = (order,$event)=> {
        console.log(order);
        $scope.detailBox = true;
        $scope.order = order;
      };

      $scope.closeDetail = () => {
        $scope.detailBox = false;
      }
  }]);

    myApp.controller('masterDetailCtr', ['$scope', '$http', 'locals', '$stateParams', function ($scope, $http, locals, $stateParams) {
        let token1 = locals.get("userToken");
        let params = $stateParams;
        let masterId = params.id;
        $http.get(url + '/api/master/findm/' + masterId, {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.master = res.data.parms.master;
                }
            });
    }]);

    myApp.controller('commentDetailCtr', ['$scope', function ($scope) {

    }]);

    myApp.controller('userDetailCtr', ['$scope', 'locals', '$http', '$stateParams', function ($scope, locals, $http, $stateParams) {
        let token1 = locals.get("userToken");
        let params = $stateParams;
        let userId = params.id;
        $http.get(url + '/api/user/find/' + userId, {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.user = res.data.parms.user;
                }
            });
    }]);

    myApp.controller('orderDetailCtr', ['$scope', 'locals', '$http', '$stateParams', function ($scope, locals, $http, $stateParams) {
        let token1 = locals.get("userToken");
        let params = $stateParams;
        console.log(params);
        let orderId = params.orderId;
        $http.get(url + '/api/order/findmanager/' + orderId, {headers: {"TOKEN": token1}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.order = res.data.parms.order;
                }
            });
    }]);

    myApp.controller('findSkillsCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        // $scope.increaseSuccess = true;
        let token = locals.get("userToken");
        $http.get(url + '/api/skill/findAll/1001')
            .then(res => {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.skill = res.data.parms.skill
                }
            });

        $scope.updateSkill = function (current, $event) {
            $scope.update = true;
            $scope.currentSkill = current.skill;
            $scope.currentId = current.id;
            console.log($scope.currentId);
            $scope.ensureUpdate = () => {
                let token2 = locals.get("userToken");
                if ($scope.newSkill) {
                    $http.post(url + '/api/skill/ud', {
                        top: 1001,
                        skill: $scope.newSkill,
                        id: $scope.currentId
                    }, {headers: {"TOKEN": token2}})
                        .then(res => {
                            console.log(res.data);
                            if (res.data.info == 1) {
                                $scope.updateSuccess = true;
                                $timeout(function () {
                                    $scope.updateSuccess = false;
                                }, 1000).then(() => {
                                    $state.reload();
                                });
                            }
                        })
                }
                else {
                    // alert(111)
                }

            }
        };

        $scope.closeUpdate = () => {
            $scope.update = false;
        };


        $scope.deleteSkill = function (current, $event) {
            console.log(current.id);
            $http.post(url + '/api/skill/delete/' + current.id, {}, {headers: {"TOKEN": token}})
                .then(res => {
                    console.log(res.data);
                    if (res.data.info == 1) {
                        $scope.deleteSuccess = true;
                        $timeout(function () {
                            $scope.deleteSuccess = false;
                        }, 1000).then(() => {
                            $state.reload();
                        });
                    }
                    else if (res.data.info == 18) {
                        $state.go("login")
                    }
                })
        };

        $scope.showIncrease = () => {
            $scope.increase = true;
        };

        $scope.closeToast = () => {
            $scope.increase = false;
        };

        $scope.increaseSkill = () => {
            let token1 = locals.get("userToken");
            if ($scope.skillInt) {
                $http.post(url + '/api/skill/add', {
                    skill: $scope.skillInt,
                    top: 1001
                }, {headers: {"TOKEN": token1}})
                    .then(res => {
                        console.log(res.data);
                        // $scope.increase = false;
                        if (res.data.info == 1) {
                            $scope.increaseSuccess = true;
                            $timeout(function () {
                                $scope.increaseSuccess = false;
                            }, 1000).then(() => {
                                $state.reload();
                            });
                        }
                        else if (res.data.info == 18) {
                            $state.go("login");
                        }
                    })
            }
            else {
                alert('请输入技能名称')
            }
        };

        $scope.uploadImg = (current, $event)=>{
            $scope.uploadPic = true;
            console.log(current.id);
            $scope.skillId = current.id;
        };

        $scope.closeUpload = () => {
            $scope.uploadPic = false;
        };

        $scope.ensureUpload = ()=>{
            var uploadPic = $.ajax({
                type: "POST",
                url: url + "/api/file/uploadSkillLogo/"+$scope.skillId,
                data: $scope.formData,
                headers: {
                    TOKEN: token
                },
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    console.log(res);
                },
                fail:function (err) {
                    console.log(err);
                }
            });
            uploadPic.done(function (data) {
                if(data.info == 1){
                    console.log(111);
                    $('#testToast').show();
                    $timeout(function () {

                    }, 1000).then(() => {
                        $state.reload();
                        // $('#testToast').hide();
                    });
                }
                else{
                    $('#testToast1').show();
                    $scope.uploadMsg = true;
                    $timeout(function () {
                    }, 1000).then(() => {
                        $('#testToast1').hide();
                    });
                }
            });
        };
        $(function () {
            // 允许上传的图片类型
            var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
            // 图片最大宽度
            // var maxWidth = 100*1024;
            // 最大上传图片数量
            $('.js_file').on('change', function (event) {
                $('#uploadBtn').show();
                $('.uploader_files').empty();
                var files = event.target.files;
                // 如果没有选中文件，直接返回
                if (files.length === 0) {
                    $('#uploadBtn').hide();
                    return;
                }

                for (var i = 0, len = files.length; i < len; i++) {
                    var file = files[i];
                    var reader = new FileReader();

                    // 如果类型不在允许的类型范围内
                    if (allowTypes.indexOf(file.type) === -1) {
                        alert( '该类型不允许上传');
                        continue;
                    }
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            // 不要超出最大宽度
                            var that = this;
                            // 默认按比例压缩
                            var w = that.width,
                                h = that.height;
                            var ratio;
                            if ((ratio = w * h / 4000000)>1) {
                                ratio = Math.sqrt(ratio);
                                w /= ratio;
                                h /= ratio;
                            }else {
                                ratio = 1;
                            }
                            var canvas = document.createElement('canvas');
                            var ctx = canvas.getContext('2d');

                            var tCanvas = document.createElement("canvas");
                            var tctx = tCanvas.getContext("2d");
                            // 设置 canvas 的宽度和高度
                            canvas.width = w;
                            canvas.height = h;
                            //铺底色
                            ctx.fillStyle = "#fff";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            //如果图片像素大于100万则使用瓦片绘制
                            var count;
                            if ((count = w * h / 1000000) > 1) {
                                count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

//            计算每块瓦片的宽和高
                                var nw = ~~(w / count);
                                var nh = ~~(h / count);

                                tCanvas.width = nw;
                                tCanvas.height = nh;

                                for (var i = 0; i < count; i++) {
                                    for (var j = 0; j < count; j++) {
                                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                                    }
                                }
                            } else {
                                ctx.drawImage(img, 0, 0, w, h);
                            }
                            // tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                            // ctx.drawImage(img, 0, 0, w, h);
                            var base64 = canvas.toDataURL('image/jpeg',1);

                            var $preview = $('<li class="uploadPic" style="background-image:url(' + base64 + ')"></li>');
                            $('.uploader_files').append($preview);
                            $scope.formData = new FormData();
                            var bl = convertBase64UrlToBlob(base64);
                            $scope.formData.append("file", bl,"file_"+Date.parse(new Date())+".jpg");
                            console.log($scope.formData);
                        };

                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

        });
        function convertBase64UrlToBlob(urlData){
            var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        }
    }]);

    myApp.controller('findWithdrawCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        let token = locals.get("userToken");
        $scope.currentPage = 1;
        // $scope.withdrawBox = true;

        $http.get(url + '/api/pocket/findAllM?page=1&size=10', {headers: {"TOKEN": token}})
            .then(res => {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.pockets = res.data.parms.pockets;
                    $scope.max = res.data.parms.maxSize;
                    // //翻页
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/pocket/findAllM?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token}})
                            .then(res => {
                                console.log(res.data);
                                $scope.pockets = res.data.parms.pockets;
                            })
                    };
                }
            });


        $scope.withDraw = (current, $event) => {
            console.log(current.id);
            console.log(current.masterId);
            console.log($scope.currentPage);
            $scope.withdrawBox = true;
            $scope.masterId = current.masterId;
            // $scope.num = current.frozen;
            $scope.aName = current.aName;
            $scope.bName = current.bName;
            if (!$scope.aName) {
                $scope.currentMaster = $scope.bName;
            }
            else {
                $scope.currentMaster = $scope.aName;
            }
        };

        $scope.ensureWithdraw = () => {
            if (!$scope.num) {
                $scope.missParms = true;
                $timeout(function () {
                    $scope.missParms = false;
                }, 1000)
            }
            else {
                $http.post(url + '/api/pocket/clear/' + $scope.masterId + '/' + $scope.num*100, {}, {headers: {"TOKEN": token}})
                    .then(res => {
                        console.log(res.data);
                        if (res.data.info == 1) {
                            $scope.withdrawSuccess = true;
                            $timeout(function () {
                                $scope.withdrawSuccess = false;
                            }, 1000).then(() => {
                                $http.get(url + '/api/pocket/findAllM?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token}})
                                    .then(res => {
                                        console.log(res.data);
                                        $scope.pockets = res.data.parms.pockets;
                                    });
                                $scope.num = '';
                                $scope.withdrawBox = false;
                            });
                        }
                        else if (res.data.info == 18) {
                            $scope.withdrawError = true;
                            $timeout(function () {
                                $scope.withdrawError = false;
                            }, 1000).then(() => {
                                $state.go("login")
                            })
                        }
                        else {
                            $scope.withdrawError = true;
                            $timeout(function () {
                                $scope.withdrawError = false;
                            }, 1000)
                        }
                    });
            }
        };

        $scope.cancelWithdraw = () => {
            $scope.withdrawBox = false;
        };

        $scope.showMaster = (current, $event) => {
            console.log(current.masterId);
            $http.get(url + '/api/master/findm/' + current.masterId, {headers: {"TOKEN": token}})
                .then(function (res) {
                    console.log(res.data);
                    $scope.master = res.data.parms.master
                });
            $scope.masterToast = true;

        };

        $scope.closeToast = () => {
            $scope.masterToast = false;
        };

    }]);

    myApp.controller('findAgencyCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        let token = locals.get("userToken");
        $scope.currentPage = 1;

        $http.get(url + '/api/agency/findprovincem?page=1&size=10', {headers: {"TOKEN": token}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.data = res.data.parms.agencies;
                    $scope.max = res.data.parms.maxSize;
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.currentPage = 1;     //当前页
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/agency/findprovincem?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token}})
                            .then(res => {
                                $scope.data = res.data.parms.agencies;
                            })
                    }
                }
            });

        $scope.agencyDetail = function (current, $event) {
            $scope.showToast = true;
            console.log(current.id);
            $http.get(url + '/api/agency/findm/' + current.id, {headers: {"TOKEN": token}})
                .then(function (res) {
                    console.log(res.data);
                    $scope.agency = res.data.parms.agency
                });
        };

        $scope.closeToast = function () {
            $scope.showToast = false;
        }

    }]);

    myApp.controller('findhousesCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        let token = locals.get("userToken");
        $scope.currentPage = 1;

        $http.get(url + '/api/agency/findhouses?page=1&size=10', {headers: {"TOKEN": token}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.data = res.data.parms.agencies;
                    $scope.max = res.data.parms.maxSize;
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.currentPage = 1;     //当前页
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/agency/findhouses?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token}})
                            .then(res => {
                                $scope.data = res.data.parms.agencies;
                            })
                    }
                }
            });

        $scope.agencyDetail = function (current, $event) {
            $scope.showToast = true;
            console.log(current.id);
            $http.get(url + '/api/agency/findm/' + current.id, {headers: {"TOKEN": token}})
                .then(function (res) {
                    console.log(res.data);
                    $scope.agency = res.data.parms.agency
                });
        };

        $scope.closeToast = function () {
            $scope.showToast = false;
        }


    }]);

    myApp.controller('findPromoterCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        let token = locals.get("userToken");
        $scope.currentPage = 1;

        $http.get(url + '/api/agency/findallm/1?page=1&size=10', {headers: {"TOKEN": token}})
            .then(function (res) {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.data = res.data.parms.agencies;
                    $scope.max = res.data.parms.maxSize;
                    $scope.totalItems = $scope.max;    //所有页面中的项目总数
                    $scope.currentPage = 1;     //当前页
                    $scope.setPage = function (pageNo) {
                        $scope.currentPage = pageNo;
                    };
                    $scope.maxSize = 5;
                    $scope.pageChanged = function () {
                        console.log($scope.currentPage);
                        $http.get(url + '/api/agency/findallm/1?page=' + $scope.currentPage + '&size=10', {headers: {"TOKEN": token}})
                            .then(res => {
                                $scope.data = res.data.parms.agencies;
                            })
                    }
                }
            });


        $scope.agencyDetail = function (current, $event) {
            $scope.showToast = true;
            console.log(current.id);
            $http.get(url + '/api/agency/findm/' + current.id, {headers: {"TOKEN": token}})
                .then(function (res) {
                    console.log(res.data);
                    $scope.agency = res.data.parms.agency
                });
        };

        $scope.closeToast = function () {
            $scope.showToast = false;
        };

        $scope.agencyWater = (current, $event) => {
            $scope.hasSign = '';
            $scope.showWater = true;
            console.log(current.id);
            $scope.agencyCid = current.id;
            let myDate = new Date();
            let currentYear = myDate.getFullYear();
            let currentMonth = myDate.getMonth() + 1;
            $scope.waterYear = currentYear;
            $scope.years = [2017,2018,2019,2020,2021];
            $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
            $scope.waterMonth = currentMonth;
            console.log( $scope.waterYear);

            $http.get(url + '/api/agency/findwithdraw/'+$scope.agencyCid +'/'+ currentYear +'/'+currentMonth, {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else if (res.data.info == 1) {
                        console.log(res.data);
                        $scope.hasSign = 1
                    }
                    else{
                        console.log(res.data);
                    }
                });

            $http.get(url + '/api/order/getMonData/'+$scope.agencyCid +'/'+ currentYear +'/'+currentMonth, {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else {
                        console.log(res.data);
                        $scope.parms = res.data.parms;
                    }
                });

            $http.get(url + '/api/order/getMonWater/'+$scope.agencyCid +'/'+ currentYear +'/'+currentMonth+'?page=1&size=30', {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else {
                        console.log(res.data);
                        $scope.orders = res.data.parms.orders;
                    }
                });

        };

        $scope.showSign = () =>{
            $scope.sign = true
        };

        $scope.ensureSign = () => {
            $http.post(url + '/api/agency/addwithdraw',{
                agencyId: $scope.agencyCid,
                year: $scope.waterYear,
                month: $scope.waterMonth,
                num: $scope.parms.num,
                sum: $scope.parms.sum
            }, {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else if(res.data.info == 1){
                        console.log(res.data);
                        $scope.sign = false;
                        $scope.hasSign = 1;
                    }
                    else{
                        alert("体现错误!")
                    }
                });
        };

        $scope.cancelSign = () => {
            $scope.sign = false
        };

        $scope.closeWater = () => {
            $scope.showWater = false;
        };

        $scope.yearChange = () => {
            console.log($scope.waterYear);
            $scope.waterMonth= '';
        };

        $scope.monthChange = () => {
            console.log('month');
            $scope.hasSign = '';
            $http.get(url + '/api/order/getMonData/'+$scope.agencyCid +'/'+ $scope.waterYear +'/'+$scope.waterMonth, {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else {
                        console.log(res.data);
                        $scope.parms = res.data.parms;
                    }
                });

            $http.get(url + '/api/agency/findwithdraw/'+$scope.agencyCid +'/'+ $scope.waterYear +'/'+$scope.waterMonth, {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else if (res.data.info == 1) {
                        console.log(res.data);
                        $scope.hasSign = 1
                    }
                    else{
                        console.log(res.data);
                    }
                });

            $http.get(url + '/api/order/getMonWater/'+$scope.agencyCid +'/'+ $scope.waterYear +'/'+$scope.waterMonth+'?page=1&size=30', {headers: {"TOKEN": token}})
                .then(function (res) {
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else {
                        console.log(res.data);
                        $scope.orders = res.data.parms.orders;
                    }
                });
        }


    }]);

    myApp.controller('addAgencyCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        let token = locals.get("userToken");
        $scope.state1 = 1;
        $scope.states = [
            {des: 1, value: '推广员'},
            {des: 2, value: '楼盘代理'},
            {des: 3, value: '省代理'},

        ];
        $scope.state = $scope.states[0];

        $scope.change1 = function (state) {
            $scope.state1 = this.state.des;
            console.log($scope.state1);
            // $http.get(url + '/api/master/findAllm/' + $scope.state1 + '?page=1&size=10', {headers: {"TOKEN": token}})
            //   .then(function (res) {
            //     console.log(res.data);
            //     $scope.data = res.data.parms.master
            //   });
        };

        $scope.addAgency = () => {
            console.log($scope.state1);
            $http.post(url + '/api/agency/add', {
                addr: $scope.addr,
                idCard: $scope.idCard,
                password: $scope.password,
                phone: $scope.phone,
                realName: $scope.realName,
                role: $scope.state1
            }, {headers: {"TOKEN": token}})
                .then(function (res) {
                    $scope.msg = res.data.msg;
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else if (res.data.info == 1) {
                        $scope.addSuccess = true;
                        $timeout(function () {
                            $scope.addSuccess = false;
                        }, 1000)
                            .then(res => {
                                $state.reload()
                            })
                    }
                    else if(res.data.info == 14){
                        $scope.msg = '手机号已存在';
                        $scope.addFail1 = true;
                        $timeout(function () {
                            $scope.addFail1 = false;
                        }, 1000)
                    }
                    else {
                        $scope.addFail = true;
                        $timeout(function () {
                            $scope.addFail = false;
                        }, 1000)
                    }
                    console.log(res.data);
                });
        }

    }]);

    myApp.controller('findCityCtr', ['$scope', 'locals', '$http', '$state', '$timeout', function ($scope, locals, $http, $state, $timeout) {
        // $scope.increaseSuccess = true;
        let token = locals.get("userToken");
        $http.get(url + '/api/master/findCity')
            .then(res => {
                if (res.data.info == 18) {
                    $state.go("login")
                }
                else {
                    console.log(res.data);
                    $scope.cities = res.data.parms.cities
                }
            });


        $scope.closeUpdate = () => {
            $scope.update = false;
        };


        $scope.deleteCity = function (current, $event) {
            console.log(current.id);
            $scope.deleteThis = true;
            $scope.currentCityId = current.id;
            $scope.currentCityName = current.city;
        };

        $scope.cancelDelete = function () {
            $scope.deleteThis = false;
        };

        $scope.ensureDelete = function () {
            $http.post(url + '/api/manager/deCity/' + $scope.currentCityId, {}, {headers: {"TOKEN": token}})
                .then(res => {
                    console.log(res.data);
                    if (res.data.info == 18) {
                        $state.go("login")
                    }
                    else if (res.data.info == 1) {
                        $scope.deleteSuccess = true;
                        $timeout(function () {
                            $scope.deleteSuccess = false;
                        }, 1000).then(() => {
                            $state.reload();
                        });
                    }
                    else {

                    }
                })
        };

        $scope.showIncrease = () => {
            $scope.increase = true;
        };

        $scope.closeToast = () => {
            $scope.increase = false;
        };

        $scope.increaseCity = () => {
            let token1 = locals.get("userToken");
            if ($scope.cityInt) {
                $http.post(url + '/api/manager/addCity/' + $scope.cityInt, {}, {headers: {"TOKEN": token1}})
                    .then(res => {
                        console.log(res.data);
                        // $scope.increase = false;
                        if (res.data.info == 18) {
                            $state.go("login")
                        }
                        else if (res.data.info == 1) {
                            $scope.increaseSuccess = true;
                            $timeout(function () {
                                $scope.increaseSuccess = false;
                            }, 1000).then(() => {
                                $state.reload();
                            });
                        }
                    })
            }
            else {
                alert('请输入城市')
            }
        }
    }]);


    myApp.factory('locals', ['$window', function ($window) {
        return {        //存储单个属性
            set: function (key, value) {
                $window.localStorage[key] = value;
            },        //读取单个属性
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },        //存储对象，以JSON格式存储
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
            },        //读取对象
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
            }

        }
    }]);

    myApp.filter('splitNumberFilter', [function () {
        return function (content) {
            return content ? content.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ") : content;
        }
    }]);

    myApp.run(['$rootScope', '$state', '$window','locals', function($rootScope, $state, $window,locals) {
        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            if(toState.name=='login')return;// 如果是进入登录界面则允许
            // console.log(toState);
            let token1 = locals.get("userToken");
            console.log(token1);
            //如果用户不存在
            if(!token1){
                console.log(111);
                event.preventDefault();// 取消默认跳转行为
                $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
            }
        });
    }])

})();