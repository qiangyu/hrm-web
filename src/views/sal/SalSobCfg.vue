<template>
    <div>
        <Pos></Pos>
    </div>
</template>

<script>
    import Pos from '../../components/sys/basic/Pos'
    export default {
        name: "SalSobCfg",
        data() {
            return {
                emps: [],
                total: 0,
                currentPage: 1,
                currentSize: 10,
                currentSalary: null,
                salaries: []
            }
        },
        components: {
            Pos
        }, 
        mounted() {
            this.initEmps();
            this.initSalaries();
        },
        methods: {
            sizeChange(size) {
                this.currentSize = size;
                this.initEmps();
            },
            currentChange(page) {
                this.currentPage = page;
                this.initEmps();
            },
            hidePop(data) {
                if (this.currentSalary) {
                    this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
                        if (resp) {
                            this.initEmps()
                        }
                    });
                }
            },
            showPop(data) {
                if (data) {
                    this.currentSalary = data.id;
                } else {
                    this.currentSalary = null;
                }
            },
            initSalaries() {
                this.getRequest("/salary/sobcfg/salaries").then(resp => {
                    if (resp) {
                        this.salaries = resp;
                    }
                })
            },
            initEmps() {
                this.getRequest("/salary/sobcfg/?page=" + this.currentPage + '&size=' + this.currentSize).then(resp => {
                    if (resp) {
                        this.emps = resp.data;
                        this.total = resp.total;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>